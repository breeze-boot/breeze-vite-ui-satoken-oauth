<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 消息添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addMsg, getMsg, editMsg } from '@/api/system/messages/msg'
import { MsgForm } from '@/api/system/messages/msg/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useDict } from '@/hooks/dict'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'MsgAddOrEdit',
  inheritAttrs: false,
})

const { MSG_TYPE, MSG_LEVEL } = useDict('MSG_TYPE', 'MSG_LEVEL')
const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const loading = ref<boolean>(false)
const visible = ref<boolean>(false)
const msgDataFormRef = ref()
const msgDataForm = ref<MsgForm>({ code: '', content: '', title: '', level: 'info', type: 0 })

const rules = ref({
  title: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('msg.fields.title'),
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('msg.fields.code'),
      trigger: 'blur',
    },
  ],
  type: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('msg.fields.type'),
      trigger: 'blur',
    },
  ],
  level: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('msg.fields.level'),
      trigger: 'blur',
    },
  ],
  content: [
    {
      required: true,
      message: t('common.placeholder.enter') + t("msg.fields.content'"),
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
  // 重置表单数据
  if (msgDataFormRef.value) {
    msgDataFormRef.value.resetFields()
  }
  if (id) {
    await getInfo(id)
  }
  visible.value = true
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  try {
    const response: any = await getMsg(JSONBigInt.parse(id))
    Object.assign(msgDataForm.value, response.data)
  } catch (err: any) {
    useMessage().error(err.message)
  }
}

/**
 * 表单提交
 */
const handleMsgDataFormSubmit = async () => {
  await msgDataFormRef.value.validate()
  loading.value = true
  const id = msgDataForm.value.id
  try {
    id ? await editMsg(id, msgDataForm.value) : await addMsg(msgDataForm.value)
    useMessage().success(`${(id ? t('common.modify') : t('common.save')) + t('common.success')}`)
    $emit('reloadDataList')
  } catch (err: any) {
    useMessage().error(err.message)
  } finally {
    visible.value = false
    loading.value = false
  }
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="!msgDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="msgDataForm"
      :rules="rules"
      ref="msgDataFormRef"
      @keyup.enter="handleMsgDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('msg.fields.title')" prop="title">
        <el-input
          v-model="msgDataForm.title"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('msg.fields.title')"
        />
      </el-form-item>

      <el-form-item :label="t('msg.fields.code')" prop="code">
        <el-input
          v-model="msgDataForm.code"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('msg.fields.code')"
        />
      </el-form-item>

      <el-form-item :label="t('msg.fields.type')" prop="type">
        <el-radio-group v-model="msgDataForm.type">
          <el-radio-button v-for="item in MSG_TYPE" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="t('msg.fields.level')" prop="level">
        <el-radio-group v-model="msgDataForm.level">
          <el-radio-button v-for="item in MSG_LEVEL" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="t('msg.fields.content')" prop="content">
        <el-input
          v-model="msgDataForm.content"
          style="width: 450px"
          :rows="6"
          type="textarea"
          :placeholder="t('common.placeholder.enter') + t('msg.fields.content')"
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
      <el-button type="primary" :loading="loading" @click="handleMsgDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
