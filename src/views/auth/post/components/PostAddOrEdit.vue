<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 职位添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addPost, getPost, editPost, checkPostCode } from '@/api/auth/post'
import { PostForm } from '@/api/auth/post/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import useWidth from '@/hooks/dialogWidth'

defineOptions({
  name: 'PostAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const postDataFormRef = ref()
const postDataForm = ref<PostForm>({})
const rules = ref({
  postCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('post.fields.postCode'),
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        checkPostCode(value, !postDataForm.value.id ? undefined : JSONBigInt.parse(postDataForm.value.id)).then(
          (response: any) => {
            if (response.data) {
              callback()
              return
            }
            callback(new Error(t('post.rules.postCodeExists')))
          },
        )
      },
      trigger: 'blur',
    },
  ],
  postName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('post.fields.postName'),
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
  postDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (postDataFormRef.value) {
    postDataFormRef.value.resetFields()
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
  const response: any = await getPost(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(postDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handlePostDataFormSubmit = () => {
  postDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = postDataForm.value.id
    if (id) {
      await editPost(id, postDataForm.value)
      ElMessage.success({
        message: `${t('common.modify') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          loading.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addPost(postDataForm.value)
      ElMessage.success({
        message: `${t('common.save') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          loading.value = false
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
    :width="useWidth()"
    :title="!postDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="postDataForm"
      :rules="rules"
      ref="postDataFormRef"
      @keyup.enter="handlePostDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('post.fields.postCode')" prop="postCode">
        <el-input
          v-model="postDataForm.postCode"
          autocomplete="off"
          clearable
          :placeholder="t('post.fields.postCode')"
        />
      </el-form-item>
      <el-form-item :label="t('post.fields.postName')" prop="postName">
        <el-input
          v-model="postDataForm.postName"
          autocomplete="off"
          clearable
          :placeholder="t('post.fields.postName')"
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
      <el-button type="primary" :loading="loading" @click="handlePostDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
