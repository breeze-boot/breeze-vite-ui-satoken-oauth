<template>
  <div class="process-panel__container" :style="{ width: `${this.width}px` }">
    <el-collapse v-model="activeTab">
      <el-collapse-item name="base">
        <template #title>
          <div class="panel-tab__title">
            <el-icon><info-filled /></el-icon>
            常规
          </div>
        </template>
        <element-base-info
          :id-edit-disabled="idEditDisabled"
          :business-object="elementBusinessObject"
          :type="elementType"
        />
      </el-collapse-item>
      <template v-if="elementType === 'Process'">
        <el-collapse-item name="condition" key="message">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><comment /></el-icon>
              消息与信号
            </div>
          </template>
          <signal-and-massage />
        </el-collapse-item>
      </template>
      <template v-if="conditionFormVisible">
        <el-collapse-item name="condition" key="condition">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><promotion /></el-icon>
              流转条件
            </div>
          </template>
          <flow-condition :business-object="elementBusinessObject" :type="elementType" />
        </el-collapse-item>
      </template>
      <template v-if="formVisible">
        <el-collapse-item name="condition" key="form">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><list /></el-icon>
              表单
            </div>
          </template>
          <element-form :id="elementId" :type="elementType" />
        </el-collapse-item>
      </template>
      <template v-if="elementType.indexOf('Task') !== -1">
        <el-collapse-item name="task" key="task">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><checked /></el-icon>
              任务
            </div>
          </template>
          <element-task :id="elementId" :type="elementType" />
        </el-collapse-item>
      </template>
      <template v-if="elementType.indexOf('Task') !== -1">
        <el-collapse-item name="multiInstance" key="multiInstance">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><help-filled /></el-icon>
              多实例
            </div>
          </template>
          <element-multi-instance :business-object="elementBusinessObject" :type="elementType" />
        </el-collapse-item>
      </template>
      <el-collapse-item name="listeners" key="listeners">
        <template #title>
          <div class="panel-tab__title">
            <el-icon><bell-filled /></el-icon>
            执行监听器
          </div>
        </template>
        <element-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="serviceListeners" key="serviceListeners">
        <template #title>
          <div class="panel-tab__title">
            <el-icon><bell-filled /></el-icon>
            服务任务监听
          </div>
        </template>
        <service-task-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <template v-if="elementType === 'UserTask'">
        <el-collapse-item name="taskListeners" key="taskListeners">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><bell-filled /></el-icon>
              任务监听器
            </div>
          </template>
          <user-task-listeners :id="elementId" :type="elementType" />
        </el-collapse-item>
      </template>
      <el-collapse-item name="extensions" key="extensions">
        <template #title>
          <div class="panel-tab__title">
            <el-icon><circle-plus /></el-icon>
            扩展属性
          </div>
        </template>
        <element-properties :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="other" key="other">
        <template #title>
          <div class="panel-tab__title">
            <el-icon><promotion /></el-icon>
            其他
          </div>
        </template>
        <element-other-config :id="elementId" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import ElementBaseInfo from '@/package/penal/base/ElementBaseInfo.vue'
import ElementOtherConfig from '@/package/penal/other/ElementOtherConfig.vue'
import ElementTask from '@/package/penal/task/ElementTask.vue'
import ElementMultiInstance from '@/package/penal/multi-instance/ElementMultiInstance.vue'
import FlowCondition from '@/package/penal/flow-condition/FlowCondition.vue'
import SignalAndMassage from '@/package/penal/signal-message/SignalAndMessage.vue'
import ElementListeners from '@/package/penal/listeners/ElementListeners.vue'
import ElementProperties from '@/package/penal/properties/ElementProperties.vue'
import ElementForm from '@/package/penal/form/ElementForm.vue'
import UserTaskListeners from '@/package/penal/listeners/UserTaskListeners.vue'
import ServiceTaskListeners from '@/package/penal/listeners/ServiceTaskListeners.vue'
import Log from '@/package/Log'
/**
 * 侧边栏
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年3月31日18:57:51
 */
export default {
  name: 'MyPropertiesPanel',
  components: {
    UserTaskListeners,
    ServiceTaskListeners,
    ElementForm,
    ElementProperties,
    ElementListeners,
    SignalAndMassage,
    FlowCondition,
    ElementMultiInstance,
    ElementTask,
    ElementOtherConfig,
    ElementBaseInfo,
  },
  componentName: 'MyPropertiesPanel',
  props: {
    bpmnModeler: Object,
    prefix: {
      type: String,
      default: 'camunda',
    },
    width: {
      type: Number,
      default: 550,
    },
    idEditDisabled: {
      type: Boolean,
      default: false,
    },
  },
  provide() {
    return {
      prefix: this.prefix,
      width: this.width,
    }
  },
  data() {
    return {
      activeTab: 'base',
      elementId: '',
      elementType: '',
      elementBusinessObject: {}, // 元素 businessObject 镜像，提供给需要做判断的组件使用
      conditionFormVisible: false, // 流转条件设置
      formVisible: false, // 表单配置
    }
  },
  watch: {
    elementId: {
      handler() {
        this.activeTab = 'base'
      },
    },
  },
  created() {
    this.initModels()
  },
  methods: {
    initModels() {
      // 初始化 modeler 以及其他 moddle
      if (!this.bpmnModeler) {
        // 避免加载时 流程图 并未加载完成
        this.timer = setTimeout(() => this.initModels(), 10)
        return
      }
      if (this.timer) clearTimeout(this.timer)
      window.bpmnInstances = {
        modeler: this.bpmnModeler,
        modeling: this.bpmnModeler.get('modeling'),
        moddle: this.bpmnModeler.get('moddle'),
        eventBus: this.bpmnModeler.get('eventBus'),
        bpmnFactory: this.bpmnModeler.get('bpmnFactory'),
        elementFactory: this.bpmnModeler.get('elementFactory'),
        elementRegistry: this.bpmnModeler.get('elementRegistry'),
        replace: this.bpmnModeler.get('replace'),
        selection: this.bpmnModeler.get('selection'),
      }
      this.getActiveElement()
    },
    getActiveElement() {
      // 初始第一个选中元素 bpmn:Process
      this.initFormOnChanged(null)
      this.bpmnModeler.on('import.done', (e) => {
        console.debug(e)
        this.initFormOnChanged(null)
      })
      // 监听选择事件，修改当前激活的元素以及表单
      this.bpmnModeler.on('selection.changed', ({ newSelection }) => {
        this.initFormOnChanged(newSelection[0] || null)
      })
      this.bpmnModeler.on('element.changed', ({ element }) => {
        // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === this.elementId) {
          this.initFormOnChanged(element)
        }
      })
    },
    // 初始化数据
    initFormOnChanged(element) {
      let activatedElement = element
      if (!activatedElement) {
        activatedElement =
          window.bpmnInstances.elementRegistry.find((el) => el.type === 'bpmn:Process') ??
          window.bpmnInstances.elementRegistry.find((el) => el.type === 'bpmn:Collaboration')
      }
      if (!activatedElement) return
      Log.printBack(
        `select element changed: id: ${activatedElement.id} , type: ${activatedElement.businessObject.$type}`,
      )
      Log.prettyInfo('businessObject', activatedElement.businessObject)
      window.bpmnInstances.bpmnElement = activatedElement
      this.bpmnElement = activatedElement
      this.elementId = activatedElement.id
      this.elementType = activatedElement.type.split(':')[1] || ''
      this.elementBusinessObject = JSON.parse(JSON.stringify(activatedElement.businessObject))
      this.conditionFormVisible = !!(
        this.elementType === 'SequenceFlow' &&
        activatedElement.source &&
        activatedElement.source.type.indexOf('StartEvent') === -1
      )
      this.formVisible = this.elementType === 'UserTask' || this.elementType === 'StartEvent'
    },
    beforeUnmount() {
      window.bpmnInstances = null
    },
  },
}
</script>
