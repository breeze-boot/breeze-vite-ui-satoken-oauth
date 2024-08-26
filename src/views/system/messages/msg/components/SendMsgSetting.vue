<!--
 * @author: gaoweixuan
 * @since: 2024-03-05
-->

<!-- 消息推送设置弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { SelectData } from '@/types/types.ts'
import SendMsg from '@/views/system/messages/msg/components/SendMsg.vue'
import useMsgStore from '@/store/modules/msg.ts'
import useUserStore from '@/store/modules/user.ts'

defineOptions({
  name: 'SendMsgMethod',
  inheritAttrs: false,
})

const methodOptions = ref<SelectData[]>([
  { value: 'ALL', label: '全部' },
  { value: 'USER', label: '指定人' },
  { value: 'DEPT', label: '指定部门' },
])
const { t } = useI18n()
const visible = ref<boolean>(false)
const currentMsgId = ref<number>()
const sendMsgMethodFormRef = ref()
const sendMsgRef = ref()
const sendMsgMethodDataForm = ref<any>({})
let msgStore = useMsgStore()
let userStore = useUserStore()

const rules = ref({
  method: [
    {
      required: true,
      message: t('msg.rules.method'),
      trigger: 'change',
    },
  ],
})

/**
 * 初始化
 *
 * @msgId 消息ID
 */
const init = async (msgId: number) => {
  currentMsgId.value = msgId
  visible.value = true
  // 重置表单数据
  if (sendMsgMethodFormRef.value) {
    sendMsgMethodFormRef.value.resetFields()
  }
}

/**
 * 表单提交
 */
const handleSendMsgMethodFormSubmit = async () => {
  sendMsgMethodFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    if (!currentMsgId.value) return
    if (sendMsgMethodDataForm.value.method === 'ALL') {
      // 发送给全部请求
      msgStore.stompClient?.publish({
        destination: '/message/asyncSendBroadcastMsg',
        body: JSON.stringify({ tenantId: userStore.userInfo.tenantId || '1', msgId: currentMsgId.value }),
      })
      return
    }
    sendMsgRef.value.init(sendMsgMethodDataForm.value.method, currentMsgId.value)
  })
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    width="15%"
    :title="t('msg.common.sendMsgMethod')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="sendMsgMethodDataForm"
      :rules="rules"
      ref="sendMsgMethodFormRef"
      @keyup.enter="handleSendMsgMethodFormSubmit()"
    >
      <el-form-item prop="method">
        <el-select style="width: 100%" v-model="sendMsgMethodDataForm.method" :placeholder="t('msg.fields.method')">
          <el-option v-for="item in methodOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleSendMsgMethodFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>

  <!-- 发送消息设置 Dialog -->
  <send-msg ref="sendMsgRef" />
</template>
