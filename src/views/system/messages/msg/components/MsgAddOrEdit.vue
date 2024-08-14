<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 消息添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addMsg, getMsg, editMsg } from '@/api/system/messages/msg'
import { MsgForm } from '@/api/system/messages/msg/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useDict } from '@/hooks/dict'

defineOptions({
  name: 'MsgAddOrEdit',
  inheritAttrs: false,
})

const { MSG_TYPE, MSG_LEVEL } = useDict('MSG_TYPE', 'MSG_LEVEL')
const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const msgDataFormRef = ref()
const msgDataForm = ref<MsgForm>({ code: '', content: '', title: '', level: 'info', type: 0 })

const rules = ref({
  title: [
    {
      required: true,
      message: t('msg.rules.title'),
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: t('msg.rules.code'),
      trigger: 'blur',
    },
  ],
  type: [
    {
      required: true,
      message: t('msg.rules.type'),
      trigger: 'blur',
    },
  ],
  level: [
    {
      required: true,
      message: t('msg.rules.level'),
      trigger: 'blur',
    },
  ],
  content: [
    {
      required: true,
      message: t('msg.rules.content'),
      trigger: 'blur',
    },
  ],
})

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  msgDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (msgDataFormRef.value) {
    msgDataFormRef.value.resetFields()
  }
  if (id) {
    await getInfo(id)
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  const response: any = await getMsg(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(msgDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleMsgDataFormSubmit = () => {
  msgDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = msgDataForm.value.id
    if (id) {
      await editMsg(id, msgDataForm.value)
      ElMessage.success({
        message: `${t('common.modify') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addMsg(msgDataForm.value)
      ElMessage.success({
        message: `${t('common.save') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    }
  })
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    width="38%"
    :title="!msgDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="msgDataForm"
      :rules="rules"
      ref="msgDataFormRef"
      @keyup.enter="handleMsgDataFormSubmit()"
      label-width="125px"
    >
      <el-form-item label-width="125px" :label="$t('msg.fields.title')" prop="title">
        <el-input v-model="msgDataForm.title" autocomplete="off" clearable :placeholder="$t('msg.fields.title')" />
      </el-form-item>

      <el-form-item label-width="125px" :label="$t('msg.fields.code')" prop="code">
        <el-input v-model="msgDataForm.code" autocomplete="off" clearable :placeholder="$t('msg.fields.code')" />
      </el-form-item>

      <el-form-item label-width="125px" :label="$t('msg.fields.type')" prop="type">
        <el-radio-group v-model="msgDataForm.type">
          <el-radio-button v-for="item in MSG_TYPE" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label-width="125px" :label="$t('msg.fields.level')" prop="level">
        <el-radio-group v-model="msgDataForm.level">
          <el-radio-button v-for="item in MSG_LEVEL" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label-width="125px" :label="$t('msg.fields.level')" prop="level">
        <el-input
          v-model="msgDataForm.content"
          style="width: 450px"
          :rows="6"
          type="textarea"
          :placeholder="$t('msg.fields.content')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleMsgDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
