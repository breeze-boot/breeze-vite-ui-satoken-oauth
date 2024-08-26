<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 文件添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FileUpload from '@/components/Upload/FileUpload/index.vue'
import { UploadUserFile } from '@/components/Upload/types/types.ts'

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const fileDataFormRef = ref()
const currentFileList = ref<UploadUserFile[]>([])

/**
 * 初始化
 */
const init = () => {
  currentFileList.value = []
  visible.value = true
}

const handleCallBack = () => {
  $emit('reloadDataList')
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
    ref="fileDataFormRef"
    :title="t('common.upload')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="300px"
  >
    <file-upload
      v-model="currentFileList"
      :drag="true"
      :multiple="false"
      :file-limit="1"
      :file-type="['image/png', 'image/jpeg', 'image/jpg']"
      :file-size="2"
      @upload-callback="handleCallBack"
    />
  </el-dialog>
</template>
