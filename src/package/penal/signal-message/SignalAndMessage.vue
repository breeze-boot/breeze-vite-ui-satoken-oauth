<template>
  <div class="panel-tab__content">
    <div class="panel-tab__content--title">
      <span>
        <el-icon style="margin-right: 8px; color: #555"><Menu /></el-icon>
        消息列表
      </span>
      <el-button size="small" type="primary" :icon="Plus" @click="openModel('message')">创建新消息</el-button>
    </div>
    <el-table :data="messageList" size="small" border>
      <el-table-column type="index" label="序号" width="60px" />
      <el-table-column label="消息ID" prop="id" max-width="300px" show-overflow-tooltip />
      <el-table-column label="消息名称" prop="name" max-width="300px" show-overflow-tooltip />
    </el-table>
    <div class="panel-tab__content--title" style="padding-top: 8px; margin-top: 8px; border-top: 1px solid #eee">
      <span>
        <el-icon style="margin-right: 8px; color: #555"><Menu /></el-icon>
        信号列表
      </span>
      <el-button size="small" type="primary" :icon="Plus" @click="openModel('signal')">创建新信号</el-button>
    </div>
    <el-table :data="signalList" size="small" border>
      <el-table-column type="index" label="序号" width="60px" />
      <el-table-column label="信号ID" prop="id" max-width="300px" show-overflow-tooltip />
      <el-table-column label="信号名称" prop="name" max-width="300px" show-overflow-tooltip />
    </el-table>

    <el-dialog
      v-model="modelVisible"
      :title="modelConfig.title"
      :close-on-click-modal="false"
      width="400px"
      append-to-body
      destroy-on-close
    >
      <el-form :model="modelObjectForm" size="small" label-width="90px" @submit.prevent>
        <el-form-item :label="modelConfig.idLabel">
          <el-input v-model="modelObjectForm.id" clearable />
        </el-form-item>
        <el-form-item :label="modelConfig.nameLabel">
          <el-input v-model="modelObjectForm.name" clearable />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button size="small" @click="modelVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addNewObject">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { Plus } from '@element-plus/icons-vue'
export default {
  name: 'SignalAndMassage',
  setup() {
    return {}
  },
  data() {
    return {
      signalList: [],
      messageList: [],
      modelVisible: false,
      modelType: '',
      modelObjectForm: {},
    }
  },
  computed: {
    Plus() {
      return Plus
    },
    modelConfig() {
      if (this.modelType === 'message') {
        return { title: '创建消息', idLabel: '消息ID', nameLabel: '消息名称' }
      } else {
        return { title: '创建信号', idLabel: '信号ID', nameLabel: '信号名称' }
      }
    },
  },
  mounted() {
    this.initDataList()
  },
  methods: {
    initDataList() {
      this.rootElements = window.bpmnInstances.modeler.getDefinitions().rootElements
      this.messageIdMap = {}
      this.signalIdMap = {}
      this.messageList = []
      this.signalList = []
      this.rootElements.forEach((el) => {
        if (el.$type === 'bpmn:Message') {
          this.messageIdMap[el.id] = true
          this.messageList.push({ ...el })
        }
        if (el.$type === 'bpmn:Signal') {
          this.signalIdMap[el.id] = true
          this.signalList.push({ ...el })
        }
      })
    },
    openModel(type) {
      this.modelType = type
      this.modelObjectForm = {}
      this.modelVisible = true
    },
    addNewObject() {
      if (this.modelType === 'message') {
        if (this.messageIdMap[this.modelObjectForm.id]) {
          return this.$message.error('该消息已存在，请修改id后重新保存')
        }
        const messageRef = window.bpmnInstances.moddle.create('bpmn:Message', this.modelObjectForm)
        this.rootElements.push(messageRef)
      } else {
        if (this.signalIdMap[this.modelObjectForm.id]) {
          return this.$message.error('该信号已存在，请修改id后重新保存')
        }
        const signalRef = window.bpmnInstances.moddle.create('bpmn:Signal', this.modelObjectForm)
        this.rootElements.push(signalRef)
      }
      this.modelVisible = false
      this.initDataList()
    },
  },
}
</script>
