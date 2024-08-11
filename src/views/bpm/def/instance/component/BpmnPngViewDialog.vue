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
const visible = ref(false)
const xmlSrc = ref<string>()

/**
 * 初始化
 *
 * @param procInstId
 */
const init = async (procInstId: string) => {
  // 重置表单数据
  if (procInstId) {
    await getInfo(procInstId)
    visible.value = true
  }
}

/**
 * 获取信息
 *
 * @param procInstId
 */
const getInfo = async (procInstId: string) => {
  const response: any = await getBpmDefinitionPng(procInstId)
  if (response.code === '0000') {
    xmlSrc.value = response.data
  }
}
defineExpose({ init })
</script>

<template>
  <el-dialog
    v-model="visible"
    top="5vh"
    width="60%"
    :title="t('common.design')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-container>
      <el-image :src="xmlSrc" />
    </el-container>
  </el-dialog>
</template>
