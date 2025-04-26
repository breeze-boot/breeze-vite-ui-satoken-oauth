<!--
 * @author: gaoweixuan
 * @since: 2025-04-22
-->

<!-- 知识库文档添加弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'
import { UploadRawFile, UploadRequestOptions, UploadUserFile } from '@/components/Upload/types/types.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addAiChatKnowledge } from '@/api/ai/chatKnowledge'

defineOptions({
  name: 'AiChatKnowledgeAdd',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const aiChatKnowledgeDataFormRef = ref()
const rules = ref({})

const previewImgUrl = ref('')
const dialogVisible = ref(false)
const currentFileList = ref<UploadUserFile[]>([])

const fileList = ref<UploadUserFile[]>([])
const fileLimit = 10
const fileSize = 10
const fileType: any[] = ['application/pdf', 'application/md']

/**
 * @param options
 */
async function handleUploadFile(options: UploadRequestOptions): Promise<any> {
  try {
    const response: any = await addAiChatKnowledge(options.file)
    const { name, url } = response.data
    currentFileList.value.splice(
      currentFileList.value.findIndex((file) => file.uid == (options.file as any).uid),
      1,
      {
        name: name,
        url: url,
      } as UploadUserFile,
    )
    fileList.value = currentFileList.value
    $emit('reloadDataList')
  } catch (err: any) {
    useMessage().error(err.message)
  }
}
const baseUrl = import.meta.env.VITE_APP_MINIO_API_URL //文件地址

const handlePreview = (uploadFile: UploadUserFile) => {
  previewImgUrl.value = baseUrl + uploadFile.url!
  dialogVisible.value = true
}

const handleExceed = () => {
  useMessage().warning(t('common.rules.fileLimit') + ' ' + fileLimit)
}

const beforeRemove = (uploadFile: UploadUserFile) => {
  ElMessageBox.confirm(t('common.rules.cancelTransfer'), ` ${uploadFile.name} ?`, {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => true)
    .catch(() => {
      ElMessage({
        type: 'info',
        message: t('common.cancel'),
      })
    })
}

/**
 * 上传头像之前操作
 *
 * @param rawFile
 */
const beforeFileUpload = (rawFile: UploadRawFile) => {
  debugger
  if (!fileType.includes(rawFile.type)) {
    ElMessage.error(t('common.rules.fileFormat'), fileType?.join(','))
    return false
  } else if (rawFile.size / 1024 / 1024 > fileSize) {
    ElMessage.error(t('common.rules.fileSize'))
    return false
  }
  return true
}

/**
 * 初始化
 */
const init = async () => {
  currentFileList.value = []
  visible.value = true
  // 重置表单数据
  if (aiChatKnowledgeDataFormRef.value) {
    aiChatKnowledgeDataFormRef.value.resetFields()
  }
}

const handleDataFormSubmit = async () => {}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog v-model="visible" :title="t('common.add')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :rules="rules" ref="aiChatKnowledgeDataFormRef" @keyup.enter="handleDataFormSubmit()" label-width="90px">
      <el-upload
        v-model:file-list="currentFileList"
        class="upload-demo"
        :http-request="handleUploadFile"
        multiple
        drag
        :on-preview="handlePreview"
        :before-upload="beforeFileUpload"
        :before-remove="beforeRemove"
        :limit="fileLimit"
        :on-exceed="handleExceed"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Drop file here or
          <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">{{ t('common.rules.fileSize') }} {{ fileLimit }} M.</div>
        </template>
      </el-upload>
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
      <el-button type="primary" :loading="loading" @click="handleDataFormSubmit()">{{ t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
