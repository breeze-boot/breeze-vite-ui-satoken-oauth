<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addFile, getFile, editFile } from '@/api/system/file'
import { File } from '@/api/system/file/type.ts'

const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const fileDataFormRef = ref()
const fileDataForm = reactive<File>({
  id: undefined,
  bizId: '',
  bizType: '',
  bucket: '',
  contentType: '',
  createTime: '',
  fileFormat: '',
  fileName: '',
  objectName: '',
  path: '',
  storeType: '',
  title: '',
  updateTime: '',
})
// 规则
const rules = ref({})

/**
 * 编辑初始化表单
 */
const init = (id?: number) => {
  visible.value = true
  fileDataForm.id = undefined
  // 重置表单数据
  if (fileDataFormRef.value) {
    fileDataFormRef.value.resetFields()
  }
  if (id) {
    getInfo(id)
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = (id: number) => {
  getFile(id).then((response: any) => {
    if (response.code === '00000') {
      Object.assign(fileDataForm, response.data)
    }
  })
}

/**
 * 提交
 */
const handleFileDataFormSubmit = () => {
  fileDataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    const fileId = fileDataForm.id
    if (fileId) {
      editFile(fileDataForm)
        .then(() => {
          ElMessage.success({
            message: '成功',
            duration: 500,
            onClose: () => {
              visible.value = false
              $emit('reloadDataList')
            },
          })
        })
        .finally(() => {})
    } else {
      addFile(fileDataForm)
        .then(() => {
          ElMessage.success({
            message: '成功',
            duration: 500,
            onClose: () => {
              visible.value = false
              $emit('reloadDataList')
            },
          })
        })
        .finally(() => {})
    }
  })
}

/**
 * 暴露方法
 */
defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="!fileDataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="fileDataForm"
      :rules="rules"
      ref="fileDataFormRef"
      @keyup.enter="handleFileDataFormSubmit"
      label-width="120px"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="fileDataForm.title" placeholder="标题" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleFileDataFormSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
