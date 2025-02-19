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

defineOptions({
  name: 'BpmnXmlViewDialog',
  inheritAttrs: false,
})

const { t } = useI18n()
const visible = ref<boolean>(false)
const xmlStr = ref<string>()
const xmlNodes = ref<any>()

/**
 * 初始化
 *
 * @param procDefKey
 * @param version
 */
const init = async (procDefKey: string, version: number) => {
  xmlStr.value = ''
  xmlNodes.value = ''
  // 重置表单数据
  if (!procDefKey) {
    visible.value = false
    return
  }
  try {
    visible.value = true
    const response: any = await getBpmDefinitionXml(procDefKey, version)
    xmlStr.value = response.data.xmlStr
    xmlNodes.value = response.data
  } catch (err: any) {
    console.error(err.message)
  }
}

defineExpose({ init })
</script>

<template>
  <el-dialog
    v-model="visible"
    top="5vh"
    :title="t('common.design')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <process-viewer :xml="xmlStr" :xmlNodes="xmlNodes" />
  </el-dialog>
</template>
