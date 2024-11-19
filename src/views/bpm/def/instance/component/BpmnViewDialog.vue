<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->

<!-- 流程定义查看弹出框 -->
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import ProcessViewer from '@/components/ProcessViewer/index.vue'
import { getBpmDefinitionXml } from '@/api/bpm/def/definition'
import { ref } from 'vue'
import useWidth from '@/hooks/dialogWidth'

defineOptions({
  name: 'BpmnViewDialog',
  inheritAttrs: false,
})

const { t } = useI18n()
const visible = ref<boolean>(false)
const xmlStr = ref<string>()
const xmlNodes = ref<any>()

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
  try {
    const response: any = await getBpmDefinitionXml(procInstId)
    xmlStr.value = response.data.xmlStr
    xmlNodes.value = response.data
  } catch (e: any) {
    console.error(e.message)
  }
}
defineExpose({ init })
</script>

<template>
  <el-dialog
    v-model="visible"
    top="5vh"
    :width="useWidth()"
    :title="t('common.design')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <process-viewer :xml="xmlStr" :xmlNodes="xmlNodes" />
  </el-dialog>
</template>
