<script setup lang="ts">
import BpmnViewer from 'bpmn-js/lib/Viewer'
import { onMounted, ref } from 'vue'

const props = defineProps({
  xml: {
    type: String,
    required: true,
  },
})

const containerEl = ref<any>(null)
const defaultZoom = ref<number>(1)
const bpmnViewer = ref<any>(null)

onMounted(() => {
  previewXml()
})

const handleReZoom = () => {
  defaultZoom.value = 1
  bpmnViewer.value.get('canvas').zoom('fit-viewport', 'auto')
}

const handleZoomIn = (zoomStep = 0.1) => {
  let newZoom = Math.floor(defaultZoom.value * 100 + zoomStep * 100) / 100
  if (newZoom > 4) {
    throw new Error('[Process Viewer Warn ]: The zoom ratio cannot be greater than 4')
  }
  defaultZoom.value = newZoom
  bpmnViewer.value.get('canvas').zoom(defaultZoom)
}

const handleZoomOut = (zoomStep = 0.1) => {
  let newZoom = Math.floor(defaultZoom.value * 100 - zoomStep * 100) / 100
  if (newZoom < 0.6) {
    throw new Error('[Process Viewer Warn ]: The zoom ratio cannot be less than 0.6')
  }
  defaultZoom.value = newZoom
  bpmnViewer.value.get('canvas').zoom(defaultZoom)
}

const previewXml = () => {
  containerEl.value = document.getElementById('container')
  // 每次清一下
  bpmnViewer.value && bpmnViewer.value.destroy()
  bpmnViewer.value = new BpmnViewer({ container: containerEl.value })
  bpmnViewer.value.importXML(props.xml, (err: any) => {
    if (!err) {
      bpmnViewer.value.get('canvas').zoom('fit-viewport', 'auto')
      return
    }
    console.error(err)
  })
}
</script>

<template>
  <div class="process-viewer__container">
    <div style="position: absolute; top: 0; left: 0; width: 100%; z-index: 999">
      <el-row type="flex" justify="end">
        <el-button type="primary" @click="previewXml">预览</el-button>
        <el-button type="primary" @click="handleReZoom">还原</el-button>
        <el-button type="success" @click="handleZoomIn()">放大</el-button>
        <el-button type="warning" @click="handleZoomOut()">缩小</el-button>
      </el-row>
    </div>
    <div style="height: 100%" id="container" class="process-viewer__canvas"></div>
  </div>
</template>

<style lang="scss">
.process-viewer__container {
  position: relative;
  border: 1px solid #efefef;
  width: 100%;
  height: calc(100vh - $tabbar-height - 50px);

  .process-viewer__canvas {
    flex: 1;
    height: 100%;
    position: relative;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')
      repeat !important;
  }
}
</style>
