<script>
import MyProcessDesigner from '@/package/designer'
import MyProcessPenal from '@/package/penal'
// 自定义渲染（隐藏了 label 标签）
import CustomRenderer from '@/modules/custom-renderer'
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from '@/package/designer/plugins/content-pad'
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from '@/package/designer/plugins/palette'

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'

export default {
  name: 'ProcessDesigner',
  props: {
    bpmnXml: {
      type: String,
      required: true,
    },
    flowForm: {
      type: Object,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    MyProcessDesigner,
    MyProcessPenal,
  },
  emits: ['save'],
  data() {
    return {
      reloadIndex: 0,
      height: window.innerHeight - 50 + 'px',
      xmlString: this.bpmnXml,
      modeler: null,
      controlDrawerVisible: false,
      infoTipVisible: false,
      controlForm: {
        processId: this.flowForm.processId || '',
        processName: this.flowForm.processName || '',
        simulation: true,
        labelEditing: false,
        labelVisible: false,
        prefix: 'flowable',
        headerButtonSize: 'default',
        additionalModel: [CustomContentPadProvider, CustomPaletteProvider],
      },
      addis: {
        CustomContentPadProvider,
        CustomPaletteProvider,
      },
    }
  },
  computed: {
    showDialog() {
      return this.show
    },
  },
  methods: {
    changePageMode(mode) {
      const theme = mode
        ? {
            // dark
            stroke: '#ffffff',
            fill: '#333333',
          }
        : {
            // light
            stroke: '#000000',
            fill: '#ffffff',
          }
      const elements = this.modeler.get('elementRegistry').getAll()
      this.modeler.get('modeling').setColor(elements, theme)
    },
    reloadProcessDesigner(notDeep) {
      this.controlForm.additionalModel = []
      for (const key in this.addis) {
        if (this.addis[key]) {
          this.controlForm.additionalModel.push(this.addis[key])
        }
      }
      !notDeep && (this.xmlString = undefined)
      this.reloadIndex += 1
      this.modeler = null // 避免 panel 异常
    },
    changeLabelEditingStatus(status) {
      this.addis.labelEditing = status ? { labelEditingProvider: ['value', ''] } : false
      this.reloadProcessDesigner()
    },
    changeLabelVisibleStatus(status) {
      this.addis.customRenderer = status ? CustomRenderer : false
      this.reloadProcessDesigner()
    },
    elementClick(element) {
      this.element = element
    },
    initModeler(modeler) {
      setTimeout(() => {
        this.modeler = modeler
      }, 10)
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    elementContextmenu(element) {},
    onSaveProcessXml(xmlData) {
      this.$emit('save', xmlData)
    },
  },
}
</script>

<template>
  <el-dialog v-model="this.showDialog" :fullscreen="true" width="100vw">
    <div :style="'display: flex; height:' + height">
      <my-process-designer
        :options="{
          taskResizingEnabled: true,
          eventResizingEnabled: true,
          minimap: {
            open: true,
          },
        }"
        v-model="xmlString"
        v-bind="controlForm"
        :processId="flowForm.definitionKey"
        :processName="flowForm.definitionName"
        :key="`designer-${reloadIndex}`"
        keyboard
        :events="['element.click', 'connection.added', 'connection.removed', 'connection.changed']"
        ref="processDesigner"
        @element-click="elementClick"
        @element-contextmenu="elementContextmenu"
        @save="onSaveProcessXml"
        @init-finished="initModeler"
      />
      <my-process-penal
        :key="`penal-${reloadIndex}`"
        :bpmn-modeler="modeler"
        :prefix="controlForm.prefix"
        class="process-panel"
      />

      <!-- demo config -->
      <div class="demo-control-bar">
        <div class="open-model-button" @click="controlDrawerVisible = true">
          <el-icon><setting /></el-icon>
        </div>
      </div>
      <el-drawer v-model="controlDrawerVisible" size="450px" title="偏好设置" append-to-body destroy-on-close>
        <el-form :model="controlForm" size="small" label-width="100px" class="control-form" @submit.prevent>
          <el-form-item label="流程ID">
            <el-input v-model="controlForm.processId" @change="reloadProcessDesigner(true)" />
          </el-form-item>
          <el-form-item label="流程名称">
            <el-input v-model="controlForm.processName" @change="reloadProcessDesigner(true)" />
          </el-form-item>
          <el-form-item label="流转模拟">
            <el-switch
              v-model="controlForm.simulation"
              inactive-text="停用"
              active-text="启用"
              @change="reloadProcessDesigner()"
            />
          </el-form-item>
          <el-form-item label="禁用双击">
            <el-switch
              v-model="controlForm.labelEditing"
              inactive-text="停用"
              active-text="启用"
              @change="changeLabelEditingStatus"
            />
          </el-form-item>
          <el-form-item label="自定义渲染">
            <el-switch
              v-model="controlForm.labelVisible"
              inactive-text="停用"
              active-text="启用"
              @change="changeLabelVisibleStatus"
            />
          </el-form-item>
          <el-form-item label="流程引擎">
            <el-radio-group v-model="controlForm.prefix" disabled @change="reloadProcessDesigner()">
              <el-radio label="camunda">camunda</el-radio>
              <el-radio label="flowable">flowable</el-radio>
              <el-radio label="activiti">activiti</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="工具栏">
            <el-radio-group v-model="controlForm.headerButtonSize">
              <el-radio label="small">small</el-radio>
              <el-radio label="default">default</el-radio>
              <el-radio label="large">large</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.demo-control-bar {
  position: fixed;
  right: 8px;
  bottom: 48px;
  z-index: 1;
}
.open-model-button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 32px;
  background: rgba(64, 158, 255, 1);
  color: #ffffff;
  cursor: pointer;
}
</style>
