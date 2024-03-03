<!--
 * @author: gaoweixuan
 * @since: 2024-03-01
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { uploadMinioS3 } from '@/api/system/file'
import { FileParam } from '@/api/system/file/type.ts'
import { UploadRawFile, UploadRequestOptions } from '@/components/Upload/types/types.ts'

defineOptions({
  name: 'AvatarUpload',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['update:imageUrl', 'update:imageName'])
const url = ref<string>('')

const props = defineProps({
  imageUrl: {
    type: String,
    default: '',
  },
  imageName: {
    type: String,
    default: '',
  },
})

/**
 * 文件路径
 */
const imageUrl = computed({
  get: () => {
    return props.imageUrl
  },
  set: (value) => {
    url.value = value
    $emit('update:imageUrl', value)
  },
})

/**
 * 文件名
 */
const imageName = computed({
  get: () => {
    return props.imageName
  },
  set: (value) => {
    $emit('update:imageName', value)
  },
})

/**
 * 上传头像
 *
 * @param options
 */
async function handleUploadFile(options: UploadRequestOptions): Promise<any> {
  const fileParam: FileParam = {
    bizType: 'system',
    title: t('common.avatar'),
  } as FileParam
  const response: any = await uploadMinioS3(options.file, fileParam)
  if (response.code === '0000') {
    imageUrl.value = response.data.url
    imageName.value = response.data.name
  }
}

/**
 * 上传头像之前操作
 *
 * @param rawFile
 */
const beforeAvatarUpload = (rawFile: UploadRawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error(t('rules.avatarFormat'))
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error(t('rules.avatarSize'))
    return false
  }
  return true
}
</script>

<template>
  <div style="width: 100%; height: 100px; display: flex; justify-content: center; align-items: center">
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="handleUploadFile"
    >
      <el-avatar :size="100" fit="contain" v-if="url" :src="url" />
      <svg-icon width="2rem" height="2rem" v-else name="plus" class="avatar-uploader-icon" />
    </el-upload>
  </div>
</template>
