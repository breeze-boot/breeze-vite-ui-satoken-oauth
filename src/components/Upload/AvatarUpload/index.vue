<!--
 * @author: gaoweixuan
 * @since: 2024-03-01
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { uploadMinioS3 } from '@/api/system/file'
import { UploadRawFile, UploadRequestOptions } from '@/components/Upload/types/types.ts'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useMessage } from '@/hooks/message'
import { FileForm } from '@/types/types.ts'

defineOptions({
  name: 'AvatarUpload',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  fileType: {
    type: Array,
    default: () => ['image/jpeg', 'image/png'],
  },
  fileSize: {
    type: Number,
    default: 2,
  },
})

/**
 * 文件路径
 */
const imageUrl = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    $emit('update:modelValue', value)
  },
})

/**
 * 上传头像
 *
 * @param options
 */
async function handleUploadFile(options: UploadRequestOptions): Promise<any> {
  try {
    const fileParam: FileForm = {
      bizType: 'system',
    } as FileForm
    const response: any = await uploadMinioS3(options.file, fileParam)
    imageUrl.value = response.data.url
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 上传头像之前操作
 *
 * @param rawFile
 */
const beforeAvatarUpload = (rawFile: UploadRawFile) => {
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
  <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100px">
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="handleUploadFile"
    >
      <el-avatar :size="100" fit="contain" v-if="imageUrl" :src="imageUrl" />
      <svg-icon width="2rem" height="2rem" v-else name="plus" class="avatar-uploader-icon" />
    </el-upload>
  </div>
</template>
