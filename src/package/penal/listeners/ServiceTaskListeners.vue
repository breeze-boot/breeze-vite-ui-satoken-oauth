<template>
  <!-- 服务服务任务-->
  <div class="panel-tab__content">
    <el-form size="small" :model="listenerForm" label-width="96px" ref="listenerFormRef" @submit.prevent>
      <el-form-item label="服务任务类型" prop="listenerType">
        <el-select
          v-model="listenerForm.listenerType"
          @change="
            () => {
              this.listenerForm.class = ''
              this.listenerForm.delegateExpression = ''
            }
          "
        >
          <el-option v-for="i in Object.keys(listenerTypeObject)" :key="i" :label="listenerTypeObject[i]" :value="i" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="listenerForm.listenerType === 'classListener'"
        label="Java类"
        prop="class"
        key="listener-class"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <el-input v-model="listenerForm.class" clearable />
      </el-form-item>
      <el-form-item
        v-if="listenerForm.listenerType === 'delegateExpressionListener'"
        label="代理表达式"
        prop="delegateExpression"
        key="listener-delegate"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <el-input v-model="listenerForm.delegateExpression" clearable />
      </el-form-item>
      <template v-if="listenerForm.listenerType === 'scriptListener'">
        <el-form-item
          label="脚本格式"
          prop="scriptFormat"
          key="listener-script-format"
          :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本格式' }"
        >
          <el-input v-model="listenerForm.scriptFormat" clearable />
        </el-form-item>
        <el-form-item
          label="脚本类型"
          prop="scriptType"
          key="listener-script-type"
          :rules="{ required: true, trigger: ['blur', 'change'], message: '请选择脚本类型' }"
        >
          <el-select v-model="listenerForm.scriptType">
            <el-option label="内联脚本" value="inlineScript" />
            <el-option label="外部脚本" value="externalScript" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="listenerForm.scriptType === 'inlineScript'"
          label="脚本内容"
          prop="value"
          key="listener-script"
          :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本内容' }"
        >
          <el-input v-model="listenerForm.value" clearable />
        </el-form-item>
        <el-form-item
          v-if="listenerForm.scriptType === 'externalScript'"
          label="资源地址"
          prop="resource"
          key="listener-resource"
          :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写资源地址' }"
        >
          <el-input v-model="listenerForm.resource" clearable />
        </el-form-item>
      </template>
    </el-form>

    <el-divider />
    <p class="listener-filed__title">
      <span>
        <el-icon><Menu /></el-icon>
        注入字段：
      </span>
      <el-button size="small" type="primary" @click="openListenerFieldForm(null)">添加字段</el-button>
    </p>
    <el-table :data="fieldsListOfListener" size="small" max-height="240" border fit style="flex: none">
      <el-table-column align="center" label="序号" width="50px" type="index" />
      <el-table-column label="字段名称" min-width="100px" prop="name" />
      <el-table-column
        label="字段类型"
        min-width="80px"
        show-overflow-tooltip
        :formatter="(row) => fieldTypeObject[row.fieldType]"
      />
      <el-table-column
        label="字段值/表达式"
        min-width="100px"
        show-overflow-tooltip
        :formatter="(row) => row.string || row.expression"
      />
      <el-table-column label="操作" width="100px">
        <template v-slot="{ row, $index }">
          <el-button link type="primary" @click="openListenerFieldForm(row, $index)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" style="color: #ff4d4f" @click="removeListenerField(row, $index)">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="element-drawer__button">
      <el-button size="small" type="primary" :icon="Plus" @click="saveListenerConfig">保 存</el-button>
    </div>
    <!-- 注入字段 编辑/创建 部分 -->
    <el-dialog title="字段配置" v-model="listenerFieldFormModelVisible" width="600px" append-to-body destroy-on-close>
      <el-form
        :model="listenerFieldForm"
        size="small"
        label-width="96px"
        ref="listenerFieldFormRef"
        style="height: 136px"
        @submit.prevent
      >
        <el-form-item label="字段名称：" prop="name" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-input v-model="listenerFieldForm.name" clearable />
        </el-form-item>
        <el-form-item label="字段类型：" prop="fieldType" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-select v-model="listenerFieldForm.fieldType">
            <el-option v-for="i in Object.keys(fieldTypeObject)" :key="i" :label="fieldTypeObject[i]" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="listenerFieldForm.fieldType === 'string'"
          label="字段值："
          prop="string"
          key="field-string"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerFieldForm.string" clearable />
        </el-form-item>
        <el-form-item
          v-if="listenerFieldForm.fieldType === 'expression'"
          label="表达式："
          prop="expression"
          key="field-expression"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerFieldForm.expression" clearable />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button size="small" @click="listenerFieldFormModelVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="saveListenerFiled">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { createFormObject, updateElementExtensions } from '../../utils'
import { eventType, fieldType, serviceListenerType } from './utilSelf'

import { Menu, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'ServiceTaskListeners',
  setup() {
    return {
      Plus,
      Menu,
    }
  },
  props: {
    id: String,
    type: String,
  },
  inject: {
    prefix: 'prefix',
    width: 'width',
  },
  data() {
    return {
      elementListenersFiledList: [],
      listenerEventTypeObject: eventType,
      listenerTypeObject: serviceListenerType,
      listenerForm: {},
      fieldTypeObject: fieldType,
      fieldsListOfListener: [],
      listenerFieldFormModelVisible: false, // 服务任务 注入字段表单弹窗 显示状态
      editingListenerFieldIndex: -1, // 字段所在下标，-1 为新增
      listenerFieldForm: {}, // 服务任务 注入字段 详情表单
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        val && val.length && this.$nextTick(() => this.resetListenersList())
      },
    },
  },
  methods: {
    resetListenersList() {
      this.bpmnElement = window.bpmnInstances.bpmnElement
      this.otherExtensionList = []
      this.elementListenersFiledList =
        this.bpmnElement.businessObject?.extensionElements?.values?.filter(
          (ex) => ex.$type === `${this.prefix}:Field`,
        ) ?? []
      let listenerType = ''
      if (this.bpmnElement.businessObject?.class) listenerType = 'classListener'
      if (this.bpmnElement.businessObject?.delegateExpression) listenerType = 'delegateExpressionListener'
      this.listenerForm = {
        listenerType: listenerType || '',
        class: this.bpmnElement.businessObject?.class || '',
        delegateExpression: this.bpmnElement.businessObject?.delegateExpression || '',
        fields: this.elementListenersFiledList,
      }
      this.openListenerForm(this.listenerForm)
    },
    openListenerForm(listener) {
      if (!listener) {
        this.listenerForm = {}
      }
      if (listener && listener.fields) {
        this.fieldsListOfListener = listener.fields.map((field) => ({
          ...field,
          fieldType: field.string ? 'string' : 'expression',
        }))
        Object.assign(this.listenerForm.fields, this.fieldsListOfListener)
      } else {
        this.fieldsListOfListener = []
        this.listenerForm['fields'] = []
      }
      this.$nextTick(() => {
        if (this.$refs['listenerFormRef']) this.$refs['listenerFormRef'].clearValidate()
      })
    },
    // 移除服务任务
    removeListener(listener, index) {
      this.$confirm('确认移除该服务任务吗？', '提示', {
        confirmButtonText: '确 认',
        cancelButtonText: '取 消',
      })
        .then(() => {
          this.bpmnElementListeners.splice(index, 1)
          // this.elementListenersList.splice(index, 1)
          updateElementExtensions(this.bpmnElement, this.otherExtensionList.concat(this.bpmnElementListeners))
        })
        .catch(() => console.info('操作取消'))
    },
    // 保存服务任务配置
    async saveListenerConfig() {
      try {
        let validateStatus = await this.$refs['listenerFormRef'].validate()
        if (!validateStatus) return // 验证不通过直接返回
        this.bpmnElementListeners = createFormObject(this.listenerForm.fields, this.prefix)
        // 保存其他配置

        this.handleSetBpmnConfig({
          class: this.listenerForm.class || '',
          delegateExpression: this.listenerForm.delegateExpression || '',
        })
        updateElementExtensions(this.bpmnElement, this.bpmnElementListeners)
        ElMessage.success('更新成功')
      } catch (e) {
        ElMessage.error('更新失败')
      }
    },
    // 打开服务任务字段编辑弹窗
    openListenerFieldForm(field, index) {
      this.listenerFieldForm = field ? JSON.parse(JSON.stringify(field)) : {}
      this.editingListenerFieldIndex = field ? index : -1
      this.listenerFieldFormModelVisible = true
      this.$nextTick(() => {
        if (this.$refs['listenerFieldFormRef']) this.$refs['listenerFieldFormRef'].clearValidate()
      })
    },
    // 保存服务任务注入字段
    async saveListenerFiled() {
      let validateStatus = await this.$refs['listenerFieldFormRef'].validate()
      if (!validateStatus) return // 验证不通过直接返回
      if (this.editingListenerFieldIndex === -1) {
        this.fieldsListOfListener.push(this.listenerFieldForm)
        this.listenerForm.fields.push(this.listenerFieldForm)
      } else {
        this.fieldsListOfListener.splice(this.editingListenerFieldIndex, 1, this.listenerFieldForm)
        this.listenerForm.fields.splice(this.editingListenerFieldIndex, 1, this.listenerFieldForm)
      }
      this.listenerFieldFormModelVisible = false
      this.$nextTick(() => (this.listenerFieldForm = {}))
    },
    // 移除服务任务字段
    removeListenerField(field, index) {
      this.$confirm('确认移除该字段吗？', '提示', {
        confirmButtonText: '确 认',
        cancelButtonText: '取 消',
      })
        .then(() => {
          this.fieldsListOfListener.splice(index, 1)
          this.listenerForm.fields.splice(index, 1)
        })
        .catch(() => console.info('操作取消'))
    },
    handleSetBpmnConfig(properties) {
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, properties)
    },
  },
}
</script>
