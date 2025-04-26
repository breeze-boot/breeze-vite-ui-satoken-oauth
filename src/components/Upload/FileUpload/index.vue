<!--
 * @author: gaoweixuan
 * @since: 2024-03-01
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadRawFile, UploadRequestOptions, UploadUserFile } from '@/components/Upload/types/types.ts'
import { uploadMinioS3 } from '@/api/system/file'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'
import { FileForm } from '@/types/types.ts'

defineOptions({
  name: 'FileUpload',
  inheritAttrs: false,
})

const { t } = useI18n()
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  drag: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  fileLimit: {
    type: Number,
    default: 1,
  },
  fileType: {
    type: Array,
    default: () => ['image/jpeg', 'image/png'],
  },
  fileSize: {
    type: Number,
    default: 2,
  },
  bizType: {
    type: String,
    default: 'system',
  },
})

const previewImgUrl = ref('')
const dialogVisible = ref(false)
const currentFileList = ref<UploadUserFile[]>([])
const $emit = defineEmits(['update:modelValue', 'upload-callback'])

const fileList = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    $emit('update:modelValue', value)
    $emit('upload-callback')
  },
})

/**
 * @param options
 */
async function handleUploadFile(options: UploadRequestOptions): Promise<any> {
  try {
    const fileForm: FileForm = {
      bizType: props.bizType,
    } as FileForm
    const response: any = await uploadMinioS3(options.file, fileForm)
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
  useMessage().warning(t('common.rules.fileLimit') + ' ' + props.fileLimit)
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
  if (!props.fileType.includes(rawFile.type)) {
    ElMessage.error(t('common.rules.fileFormat'), props.fileType?.join(','))
    return false
  } else if (rawFile.size / 1024 / 1024 > props.fileSize) {
    ElMessage.error(t('common.rules.fileSize'))
    return false
  }
  return true
}
</script>

<template>
  <el-upload
    v-model:file-list="currentFileList"
    class="upload-demo"
    :http-request="handleUploadFile"
    :multiple="props.multiple"
    :drag="props.drag"
    :on-preview="handlePreview"
    :before-upload="beforeFileUpload"
    :before-remove="beforeRemove"
    :limit="props.fileLimit"
    :on-exceed="handleExceed"
  >
    <el-icon class="el-icon--upload" v-if="props.drag"><upload-filled /></el-icon>
    <div class="el-upload__text" v-if="props.drag">
      Drop file here or
      <em>click to upload</em>
    </div>

    <el-button type="primary" v-else>{{ t('common.upload') }}</el-button>
    <template #tip>
      <div class="el-upload__tip">{{ t('common.rules.fileSize') }} {{ props.fileSize }} M.</div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img :src="previewImgUrl" alt="Preview Image" width="100%" />
  </el-dialog>
</template>
