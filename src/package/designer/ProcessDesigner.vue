<template>
  <div class="my-process-designer">
    <div class="my-process-designer__header">
      <slot name="control-header"></slot>
      <template v-if="!$slots['control-header']">
        <el-button :size="headerButtonSize" :type="headerButtonType" @click="saveProcessAsXml">保存流程</el-button>
        <el-button-group key="file-control">
          <el-button
            :size="headerButtonSize"
            :type="headerButtonType"
            :icon="FolderOpened"
            @click="$refs.refFile.click()"
          >
            打开文件
          </el-button>
          <el-tooltip effect="light">
            <template #content>
              <el-button :size="headerButtonSize" type="text" @click="downloadProcessAsXml()">下载为XML文件</el-button>
              <br />
              <el-button :size="headerButtonSize" type="text" @click="downloadProcessAsSvg()">下载为SVG文件</el-button>
              <br />
              <el-button :size="headerButtonSize" type="text" @click="downloadProcessAsBpmn()">
                下载为BPMN文件
              </el-button>
            </template>
            <el-button :size="headerButtonSize" :type="headerButtonType" :icon="Download">下载文件</el-button>
          </el-tooltip>
          <el-tooltip effect="light">
            <template #content>
              <el-button :size="headerButtonSize" type="text" @click="previewProcessXML">预览XML</el-button>
              <br />
              <el-button :size="headerButtonSize" type="text" @click="previewProcessJson">预览JSON</el-button>
            </template>
            <el-button :size="headerButtonSize" :type="headerButtonType" :icon="View">预览</el-button>
          </el-tooltip>
          <template v-if="simulation">
            <el-tooltip effect="light" :content="this.simulationStatus ? '退出模拟' : '开启模拟'">
              <el-button :size="headerButtonSize" :type="headerButtonType" :icon="Cpu" @click="processSimulation">
                模拟
              </el-button>
            </el-tooltip>
          </template>
        </el-button-group>
        <el-button-group key="align-control">
          <el-tooltip effect="light" content="向左对齐">
            <el-button
              :size="headerButtonSize"
              class="align align-left"
              :icon="Histogram"
              @click="elementsAlign('left')"
            />
          </el-tooltip>
          <el-tooltip effect="light" content="向右对齐">
            <el-button
              :size="headerButtonSize"
              class="align align-right"
              :icon="Histogram"
              @click="elementsAlign('right')"
            />
          </el-tooltip>
          <el-tooltip effect="light" content="向上对齐">
            <el-button
              :size="headerButtonSize"
              class="align align-top"
              :icon="Histogram"
              @click="elementsAlign('top')"
            />
          </el-tooltip>
          <el-tooltip effect="light" content="向下对齐">
            <el-button
              :size="headerButtonSize"
              class="align align-bottom"
              :icon="Histogram"
              @click="elementsAlign('bottom')"
            />
          </el-tooltip>
          <el-tooltip effect="light" content="水平居中">
            <el-button
              :size="headerButtonSize"
              class="align align-center"
              :icon="Histogram"
              @click="elementsAlign('center')"
            />
          </el-tooltip>
          <el-tooltip effect="light" content="垂直居中">
            <el-button
              :size="headerButtonSize"
              class="align align-middle"
              :icon="Histogram"
              @click="elementsAlign('middle')"
            />
          </el-tooltip>
        </el-button-group>
        <el-button-group key="scale-control">
          <el-tooltip effect="light" content="缩小视图">
            <el-button
              :size="headerButtonSize"
              :disabled="defaultZoom < 0.2"
              :icon="ZoomOut"
              @click="processZoomOut()"
            />
          </el-tooltip>
          <el-button :size="headerButtonSize">{{ Math.floor(this.defaultZoom * 10 * 10) + '%' }}</el-button>
          <el-tooltip effect="light" content="放大视图">
            <el-button :size="headerButtonSize" :disabled="defaultZoom > 4" :icon="ZoomIn" @click="processZoomIn()" />
          </el-tooltip>
          <el-tooltip effect="light" content="重置视图并居中">
            <el-button :size="headerButtonSize" :icon="ScaleToOriginal" @click="processReZoom()" />
          </el-tooltip>
        </el-button-group>
        <el-button-group key="stack-control">
          <el-tooltip effect="light" content="撤销">
            <el-button :size="headerButtonSize" :disabled="!revocable" :icon="RefreshLeft" @click="processUndo()" />
          </el-tooltip>
          <el-tooltip effect="light" content="恢复">
            <el-button :size="headerButtonSize" :disabled="!recoverable" :icon="RefreshRight" @click="processRedo()" />
          </el-tooltip>
          <el-tooltip effect="light" content="重新绘制">
            <el-button :size="headerButtonSize" :icon="Refresh" @click="processRestart" />
          </el-tooltip>
        </el-button-group>
      </template>
      <!-- 用于打开本地文件-->
      <input
        type="file"
        id="files"
        ref="refFile"
        style="display: none"
        accept=".xml, .bpmn"
        @change="importLocalFile"
      />
    </div>
    <div class="my-process-designer__container">
      <div class="my-process-designer__canvas" ref="bpmn-canvas"></div>
    </div>
    <el-dialog :title="`预览${previewType}`" width="60%" v-model="previewModelVisible" append-to-body destroy-on-close>
      <template v-if="previewType === 'xml'">
        <Codemirror v-model:value="previewResult" :options="cmOptions" border :height="600" />
      </template>
      <template v-if="previewType === 'json'">
        <vue-jsoneditor mode="tree" v-model:json="previewResult" />
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  Histogram,
  Cpu,
  Refresh,
  RefreshLeft,
  RefreshRight,
  ZoomOut,
  ZoomIn,
  View,
  Download,
  FolderOpened,
  ScaleToOriginal,
} from '@element-plus/icons-vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import DefaultEmptyXML from './plugins/defaultEmpty'
// 翻译方法
import customTranslate from './plugins/translate/customTranslate'
import translationsCN from './plugins/translate/zh'
// 模拟流转流程
import tokenSimulation from 'bpmn-js-token-simulation'
// 标签解析构建器
// import bpmnPropertiesProvider from "bpmn-js-properties-panel/lib/provider/bpmn";
// 标签解析 Moddle
import camundaModdleDescriptor from './plugins/descriptor/camundaDescriptor.json'
import activitiModdleDescriptor from './plugins/descriptor/activitiDescriptor.json'
import flowableModdleDescriptor from './plugins/descriptor/flowableDescriptor.json'
// 标签解析 Extension
import camundaModdleExtension from './plugins/extension-moddle/camunda'
import activitiModdleExtension from './plugins/extension-moddle/activiti'
import flowableModdleExtension from './plugins/extension-moddle/flowable'
// 引入json转换与高亮
import X2JS from 'x2js'

import Codemirror from 'codemirror-editor-vue3'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/javascript/javascript.js'
import { nextTick } from 'vue'
import VueJsoneditor from 'vue3-ts-jsoneditor'

export default {
  name: 'MyProcessDesigner',
  componentName: 'MyProcessDesigner',
  components: {
    VueJsoneditor,
    Codemirror,
  },
  setup() {
    return {
      Histogram,
      Cpu,
      Refresh,
      RefreshLeft,
      RefreshRight,
      ZoomOut,
      ZoomIn,
      View,
      Download,
      FolderOpened,
      ScaleToOriginal,
    }
  },
  emits: [
    'destroy',
    'init-finished',
    'commandStack-changed',
    'update:modelValue',
    'change',
    'canvas-viewbox-changed',
    'element-click',
  ],
  props: {
    modelValue: String, // xml 字符串
    processId: String,
    processName: String,
    translations: Object, // 自定义的翻译文件
    options: {
      type: Object,
      default: () => ({}),
    }, // 自定义的翻译文件
    additionalModel: [Object, Array], // 自定义model
    moddleExtension: Object, // 自定义moddle
    onlyCustomizeAddi: {
      type: Boolean,
      default: false,
    },
    onlyCustomizeModdle: {
      type: Boolean,
      default: false,
    },
    simulation: {
      type: Boolean,
      default: true,
    },
    keyboard: {
      type: Boolean,
      default: true,
    },
    prefix: {
      type: String,
      default: 'camunda',
    },
    events: {
      type: Array,
      default: () => ['element.click'],
    },
    headerButtonSize: {
      type: String,
      default: 'small',
      validator: (value) => ['default', 'medium', 'small', 'mini'].indexOf(value) !== -1,
    },
    headerButtonType: {
      type: String,
      default: 'primary',
      validator: (value) => ['default', 'primary', 'success', 'warning', 'danger', 'info'].indexOf(value) !== -1,
    },
  },
  data() {
    return {
      defaultZoom: 1,
      previewModelVisible: false,
      simulationStatus: false,
      previewResult: '',
      previewType: 'xml',
      recoverable: false,
      revocable: false,
      cmOptions: {
        mode: 'xml', // 语言模式
        theme: 'monokai', // 主题
        lineNumbers: true, // 显示行号
        smartIndent: true, // 智能缩进
        readOnly: true,
        indentUnit: 2, // 智能缩进单位为4个空格长度
        foldGutter: true, // 启用行槽中的代码折叠
        styleActiveLine: true, // 显示选中行的样式
      },
    }
  },
  computed: {
    additionalModules() {
      const Modules = []
      // 仅保留用户自定义扩展模块
      if (this.onlyCustomizeAddi) {
        if (Object.prototype.toString.call(this.additionalModel) === '[object Array]') {
          return this.additionalModel || []
        }
        return [this.additionalModel]
      }

      // 插入用户自定义扩展模块
      if (Object.prototype.toString.call(this.additionalModel) === '[object Array]') {
        Modules.push(...this.additionalModel)
      } else {
        this.additionalModel && Modules.push(this.additionalModel)
      }

      // 翻译模块
      const TranslateModule = {
        translate: ['value', customTranslate(this.translations || translationsCN)],
      }
      Modules.push(TranslateModule)

      // 模拟流转模块
      if (this.simulation) {
        Modules.push(tokenSimulation)
      }

      // 根据需要的流程类型设置扩展元素构建模块
      // if (this.prefix === "bpmn") {
      //   Modules.push(bpmnModdleExtension);
      // }
      if (this.prefix === 'camunda') {
        Modules.push(camundaModdleExtension)
      }
      if (this.prefix === 'flowable') {
        Modules.push(flowableModdleExtension)
      }
      if (this.prefix === 'activiti') {
        Modules.push(activitiModdleExtension)
      }

      return Modules
    },
    moddleExtensions() {
      const Extensions = {}
      // 仅使用用户自定义模块
      if (this.onlyCustomizeModdle) {
        return this.moddleExtension || null
      }

      // 插入用户自定义模块
      if (this.moddleExtension) {
        for (let key in this.moddleExtension) {
          Extensions[key] = this.moddleExtension[key]
        }
      }

      // 根据需要的 "流程类型" 设置 对应的解析文件
      if (this.prefix === 'activiti') {
        Extensions.activiti = activitiModdleDescriptor
      }
      if (this.prefix === 'flowable') {
        Extensions.flowable = flowableModdleDescriptor
      }
      if (this.prefix === 'camunda') {
        Extensions.camunda = camundaModdleDescriptor
      }

      return Extensions
    },
  },
  mounted() {
    this.initBpmnModeler()
    nextTick(() => {
      this.createNewDiagram(this.modelValue)
    })
    // this.$once("hook:beforeUnmount", () => {
    //   if (this.bpmnModeler) this.bpmnModeler.destroy();
    //   this.$emit("destroy", this.bpmnModeler);
    //   this.bpmnModeler = null;
    // });
  },
  beforeUnmount() {
    if (this.bpmnModeler) this.bpmnModeler.destroy()
    this.$emit('destroy', this.bpmnModeler)
    this.bpmnModeler = null
  },
  methods: {
    initBpmnModeler() {
      if (this.bpmnModeler) return
      this.bpmnModeler = new BpmnModeler({
        container: this.$refs['bpmn-canvas'],
        keyboard: this.keyboard ? { bindTo: document } : null,
        additionalModules: this.additionalModules,
        moddleExtensions: this.moddleExtensions,
        ...this.options,
      })
      this.$emit('init-finished', this.bpmnModeler)
      this.initModelListeners()
    },
    initModelListeners() {
      const EventBus = this.bpmnModeler.get('eventBus')
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this
      // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
      this.events.forEach((event) => {
        EventBus.on(event, function (eventObj) {
          let eventName = event.replace(/\./g, '-')
          let element = eventObj ? eventObj.element : null
          that.$emit(eventName, element, eventObj)
        })
      })
      // 监听图形改变返回xml
      EventBus.on('commandStack.changed', async (event) => {
        try {
          this.recoverable = this.bpmnModeler.get('commandStack').canRedo()
          this.revocable = this.bpmnModeler.get('commandStack').canUndo()
          let { xml } = await this.bpmnModeler.saveXML({ format: true })
          this.$emit('commandStack-changed', event)
          this.$emit('update:modelValue', xml)
          this.$emit('change', xml)
        } catch (err) {
          console.error(`[Process Designer Warn]: ${err.message || err}`)
        }
      })
      // 监听视图缩放变化
      this.bpmnModeler.on('canvas.viewbox.changed', ({ viewbox }) => {
        this.$emit('canvas-viewbox-changed', { viewbox })
        const { scale } = viewbox
        this.defaultZoom = Math.floor(scale * 100) / 100
      })
    },
    /* 创建新的流程图 */
    async createNewDiagram(xml) {
      // 将字符串转换成图显示出来
      let newId = this.processId || `Process_${new Date().getTime()}`
      let newName = this.processName || `业务流程_${new Date().getTime()}`
      let xmlString = xml || DefaultEmptyXML(newId, newName, this.prefix)
      try {
        let { warnings } = await this.bpmnModeler.importXML(xmlString)
        if (warnings && warnings.length) {
          warnings.forEach((warn) => console.warn(warn))
        }
      } catch (e) {
        console.error(`[Process Designer Warn]: ${e?.message || e}`)
      } finally {
        this.processReZoom()
      }
    },

    // 下载流程图到本地
    /**
     * @param {string} type
     * @param {*} name
     */
    async downloadProcess(type, name) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this = this
        // 按需要类型创建文件并下载
        if (type === 'xml' || type === 'bpmn') {
          const { err, xml } = await this.bpmnModeler.saveXML()
          // 读取异常时抛出异常
          if (err) {
            console.error(`[Process Designer Warn ]: ${err.message || err}`)
          }
          let { href, filename } = _this.setEncoded(type.toUpperCase(), name, xml)
          downloadFunc(href, filename)
        } else {
          const { err, svg } = await this.bpmnModeler.saveSVG()
          // 读取异常时抛出异常
          if (err) {
            return console.error(err)
          }
          let { href, filename } = _this.setEncoded('SVG', name, svg)
          downloadFunc(href, filename)
        }
      } catch (e) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`)
      }
      // 文件下载方法
      function downloadFunc(href, filename) {
        if (href && filename) {
          let a = document.createElement('a')
          a.download = filename //指定下载的文件名
          a.href = href //  URL对象
          a.click() // 模拟点击
          URL.revokeObjectURL(a.href) // 释放URL 对象
        }
      }
    },

    // 根据所需类型进行转码并返回下载地址
    setEncoded(type, filename = 'diagram', data) {
      const encodedData = encodeURIComponent(data)
      return {
        filename: `${filename}.${type}`,
        href: `data:application/${type === 'svg' ? 'text/xml' : 'bpmn20-xml'};charset=UTF-8,${encodedData}`,
        data,
      }
    },

    // 加载本地文件
    importLocalFile() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this
      const file = this.$refs.refFile.files[0]
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = function () {
        let xmlStr = this.result
        that.createNewDiagram(xmlStr)
      }
    },
    /* ------------------------------------------------ refs methods ------------------------------------------------------ */
    saveProcessAsXml() {
      return new Promise((resolve, reject) => {
        if (this.bpmnModeler == null) {
          reject()
        }
        this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
          const id = this.bpmnModeler.getDefinitions().rootElements[0].id
          const name = this.bpmnModeler.getDefinitions().rootElements[0].name
          this.$emit('save', xml, id, name)
          resolve(xml)
        })
      })
    },
    downloadProcessAsXml() {
      this.downloadProcess('xml')
    },
    downloadProcessAsBpmn() {
      this.downloadProcess('bpmn')
    },
    downloadProcessAsSvg() {
      this.downloadProcess('svg')
    },
    processSimulation() {
      this.simulationStatus = !this.simulationStatus
      this.simulation && this.bpmnModeler.get('toggleMode').toggleMode()
    },
    processRedo() {
      this.bpmnModeler.get('commandStack').redo()
    },
    processUndo() {
      this.bpmnModeler.get('commandStack').undo()
    },
    processZoomIn(zoomStep = 0.1) {
      let newZoom = Math.floor(this.defaultZoom * 100 + zoomStep * 100) / 100
      if (newZoom > 4) {
        throw new Error('[Process Designer Warn ]: The zoom ratio cannot be greater than 4')
      }
      this.defaultZoom = newZoom
      this.bpmnModeler.get('canvas').zoom(this.defaultZoom)
    },
    processZoomOut(zoomStep = 0.1) {
      let newZoom = Math.floor(this.defaultZoom * 100 - zoomStep * 100) / 100
      if (newZoom < 0.2) {
        throw new Error('[Process Designer Warn ]: The zoom ratio cannot be less than 0.2')
      }
      this.defaultZoom = newZoom
      this.bpmnModeler.get('canvas').zoom(this.defaultZoom)
    },
    processZoomTo(newZoom = 1) {
      if (newZoom < 0.2) {
        throw new Error('[Process Designer Warn ]: The zoom ratio cannot be less than 0.2')
      }
      if (newZoom > 4) {
        throw new Error('[Process Designer Warn ]: The zoom ratio cannot be greater than 4')
      }
      this.defaultZoom = newZoom
      this.bpmnModeler.get('canvas').zoom(newZoom)
    },
    processReZoom() {
      this.defaultZoom = 1
      if (this.bpmnModeler) this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')
    },
    processRestart() {
      this.recoverable = false
      this.revocable = false
      this.createNewDiagram(null)
    },
    elementsAlign(align) {
      const Align = this.bpmnModeler.get('alignElements')
      const Selection = this.bpmnModeler.get('selection')
      const SelectedElements = Selection.get()
      if (!SelectedElements || SelectedElements.length <= 1) {
        this.$message.warning('请按住 Ctrl 键选择多个元素对齐')
        return
      }
      this.$confirm('自动对齐可能造成图形变形，是否继续？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => Align.trigger(SelectedElements, align))
    },
    /*-----------------------------    方法结束     ---------------------------------*/
    previewProcessXML() {
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.previewResult = xml
        this.previewType = 'xml'
        this.cmOptions.mode = 'xml'
        this.previewModelVisible = true
      })
    },
    previewProcessJson() {
      const newConvert = new X2JS()
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        const { definitions } = newConvert.xml2js(xml)
        if (definitions) {
          this.previewResult = JSON.stringify(definitions, null, 4)
        } else {
          this.previewResult = ''
        }
        this.previewType = 'json'
        this.previewModelVisible = true
      })
    },
  },
}
</script>
