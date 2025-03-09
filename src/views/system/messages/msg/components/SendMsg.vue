<!--
 * @author: gaoweixuan
 * @since: 2024-03-05
-->

<!-- 消息推送弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Option, SelectData } from '@/types/types.ts'
import { selectDept } from '@/api/auth/dept'
import { listDeptUser } from '@/api/auth/user'
import { UserRecord } from '@/api/auth/user/type.ts'
import useMsgStore from '@/store/modules/msg.ts'
import useUserStore from '@/store/modules/user.ts'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'SendMsg',
  inheritAttrs: false,
})

const userList = ref<Option[]>()
const deptOption = ref<SelectData[]>()
const { t } = useI18n()
const loading = ref<boolean>(false)
const visible = ref<boolean>(false)
const sendMsgFormRef = ref()
const sendMsgDataForm = ref<any>({})
const currentMsgId = ref<number>()
const currentMethod = ref<string>()
let msgStore = useMsgStore()
let userStore = useUserStore()

//SendMsgRecord
const rules = ref({
  deptId: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('msg.fields.deptId'),
      trigger: 'blur',
    },
  ],
  userId: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('msg.fields.userId'),
      trigger: 'blur',
    },
  ],
})

/**
 * 初始化
 *
 * @msgId 消息ID
 */
const init = async (method: string, msgId: number) => {
  currentMsgId.value = msgId
  currentMethod.value = method
  visible.value = true
  // 重置表单数据
  if (sendMsgFormRef.value) {
    sendMsgFormRef.value.resetFields()
  }

  await initDeptSelect()
}

const initDeptSelect = async () => {
  try {
    const response: any = await selectDept()
    deptOption.value = response.data
  } catch (err: any) {
    useMessage().error(`${t('common.fail')}` + err.message)
  }
}

const handleChangeDept = (deptId: number) => {
  initUserTransferData(deptId)
}

/**
 * 表单提交
 */
const handleSendMsgFormSubmit = async () => {
  await sendMsgFormRef.value.validate
  if (!currentMsgId.value) {
    useMessage().warning(t('msg.rules.msgId'))
    return
  }

  if (currentMethod.value === 'USER') {
    msgStore.stompClient?.publish({
      destination: '/send/asyncSendMsgToUser',
      headers: {
        Authorization: userStore.accessToken,
        username: userStore.userInfo.username,
      },
      body: JSON.stringify({
        tenantId: userStore.userInfo.tenantId || '1',
        msgId: currentMsgId.value,
        userIds: sendMsgDataForm.value.userId,
      }),
    })
  }
  if (currentMethod.value === 'DEPT') {
    msgStore.stompClient?.publish({
      destination: '/send/syncSendMsgDeptUser',
      headers: {
        Authorization: userStore.accessToken,
        username: userStore.userInfo.username,
      },
      body: JSON.stringify({
        tenantId: userStore.userInfo.tenantId || '1',
        msgId: currentMsgId.value,
        deptId: sendMsgDataForm.value.deptId,
      }),
    })
  }
}

const initUserTransferData = async (deptId?: number) => {
  try {
    const response: any = await listDeptUser(deptId)
    const data: Option[] = []
    response.data?.forEach((user: UserRecord) => {
      data.push({
        label: user.username as string,
        key: user.id as number,
        initial: user.userCode as string,
      })
    })
    userList.value = data
  } catch (err: any) {
    useMessage().error(err.message)
  }
}

const filterMethod = (query: string, item: Option) => {
  return item.initial.toLowerCase().includes(query.toLowerCase())
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="t('msg.common.sendMsg')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      style="height: auto; padding-bottom: 10px"
      :model="sendMsgDataForm"
      :rules="rules"
      ref="sendMsgFormRef"
      @keyup.enter="handleSendMsgFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('msg.fields.deptId')" prop="deptId">
        <el-cascader
          tag-type="info"
          @change="handleChangeDept"
          v-model="sendMsgDataForm.deptId"
          :options="deptOption"
          :props="{ checkStrictly: true, emitPath: false, value: 'value', label: 'label' }"
          :show-all-levels="false"
          clearable
          filterable
          :placeholder="t('msg.fields.deptId')"
        />
      </el-form-item>

      <el-form-item v-if="currentMethod === 'USER'" :label="t('msg.fields.userId')" prop="userId">
        <el-transfer
          :titles="[t('common.toBeSelectedColumns'), t('common.selectedColumns')]"
          v-model="sendMsgDataForm.userId"
          filterable
          :filter-method="filterMethod"
          filter-placeholder=""
          :data="userList"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        @click="
          () => {
            visible = false
            loading = false
          }
        "
      >
        {{ t('common.cancel') }}
      </el-button>
      <el-button type="primary" :loading="loading" @click="handleSendMsgFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped></style>
