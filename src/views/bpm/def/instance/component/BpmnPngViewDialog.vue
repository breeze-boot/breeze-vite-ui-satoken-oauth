<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->

<!-- 流程定义查看弹出框 -->
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { getBpmDefinitionPng } from '@/api/bpm/def/definition'
import { ref } from 'vue'

defineOptions({
  name: 'BpmnViewDialog',
  inheritAttrs: false,
})

const { t } = useI18n()
const visible = ref<boolean>(false)
const xmlSrc = ref<string>()

/**
 * 初始化
 *
 * @param procDefKey
 * @param version
 */
const init = async (procDefKey: string, version: number) => {
  // 重置表单数据
  if (!procDefKey) {
    visible.value = false
  }
  try {
    visible.value = true
    const response: any = await getBpmDefinitionPng(procDefKey, version)
    xmlSrc.value = response.data
  } catch (err: any) {
    console.error(err.message)
  }
}

defineExpose({ init })
</script>

<template>
  <el-dialog
    v-model="visible"
    top="10%"
    :title="t('common.design')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-container>
      <el-image :src="xmlSrc" />
    </el-container>
  </el-dialog>
</template>
