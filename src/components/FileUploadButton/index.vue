<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { UploadRawFile, UploadRequestOptions, UploadUserFile } from '@/components/Upload/types/types.ts'
import { uploadMinioS3 } from '@/api/system/file'
import { useI18n } from 'vue-i18n'
import SvgButton from '@/components/SvgButton/index.vue'
import { useMessage } from '@/hooks/message'
import { FileForm } from '@/types/types.ts'

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
const handleRemove = (file: File, uploadFiles: UploadUserFile[]) => {
  console.log(file, uploadFiles)
}

const handlePreview = (uploadFile: UploadUserFile) => {
  console.log(uploadFile)
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
      useMessage().info(t('common.cancel'))
    })
}

/**
 * 上传之前操作
 *
 * @param rawFile
 */
const beforeFileUpload = (rawFile: UploadRawFile) => {
  if (!props.fileType.includes(rawFile.type)) {
    useMessage().error(t('common.rules.fileFormat') + props.fileType?.join(','))
    return false
  } else if (rawFile.size / 1024 / 1024 > props.fileSize) {
    useMessage().error(t('common.rules.fileSize'))
    return false
  }
  return true
}
</script>
<template>
  <el-popover placement="bottom" :width="300" trigger="click">
    <template #reference>
      <svg-button icon="upload" :label="t('common.upload')" />
    </template>
    <el-upload
      v-model:file-list="currentFileList"
      class="upload-demo"
      :multiple="props.multiple"
      :drag="props.drag"
      :on-preview="handlePreview"
      :http-request="handleUploadFile"
      :on-remove="handleRemove"
      :before-upload="beforeFileUpload"
      :before-remove="beforeRemove"
      :limit="props.fileLimit"
      :on-exceed="handleExceed"
    >
      <el-button type="primary">{{ t('common.upload') }}</el-button>
      <template #tip>
        <div class="el-upload__tip">{{ t('common.rules.fileSize') }} {{ props.fileSize }} M.</div>
      </template>
    </el-upload>
  </el-popover>
</template>
