<template>
  <div style="margin-top: 16px">
    <el-form-item label="处理用户">
      <!--
      <el-select v-model="userTaskForm.assignee" @change="updateElementTask('assignee')">
        <el-option v-for="ak in mockData" :key="'ass-' + ak" :label="`用户${ak}`" :value="`user${ak}`" />
      </el-select>
      -->
      <el-input v-model="userTaskForm.assignee" placeholder="">
        <template #append>
          <el-button :icon="Search" @click="assigneeUserDialogVisible = true" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="候选用户">
      <!--
      <el-select
        v-model="userTaskForm.candidateUsers"
        multiple
        collapse-tags
        @change="updateElementTask('candidateUsers')"
      >
        <el-option v-for="uk in mockData" :key="'user-' + uk" :label="`用户${uk}`" :value="`user${uk}`" />
      </el-select>-->

      <el-input v-model="userTaskForm.candidateUsers" placeholder="">
        <template #append>
          <el-button :icon="Search" @click="candidateUserDialogVisible = true" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="候选分组">
      <!--
      <el-select
        v-model="userTaskForm.candidateGroups"
        multiple
        collapse-tags
        @change="updateElementTask('candidateGroups')"
      >
        <el-option v-for="gk in mockData" :key="'ass-' + gk" :label="`分组${gk}`" :value="`group${gk}`" />
      </el-select>
      -->

      <el-input v-model="userTaskForm.candidateGroups" placeholder="">
        <template #append>
          <el-button :icon="Search" @click="candidateGroupsDialogVisible = true" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="到期时间">
      <el-input v-model="userTaskForm.dueDate" clearable @change="updateElementTask('dueDate')" />
    </el-form-item>
    <el-form-item label="跟踪时间">
      <el-input v-model="userTaskForm.followUpDate" clearable @change="updateElementTask('followUpDate')" />
    </el-form-item>
    <el-form-item label="优先级">
      <el-input v-model="userTaskForm.priority" clearable @change="updateElementTask('priority')" />
    </el-form-item>
  </div>

  <user-dialog
    ref="assigneeUserDialog"
    :single="true"
    v-model:modelValue="assigneeUserDialogVisible"
    @updateUserData="
      (userCode) => {
        userTaskForm.assignee = userCode
        updateElementTask('assignee')
      }
    "
  />
  <user-dialog
    ref="candidateUserDialog"
    :single="false"
    v-model:modelValue="candidateUserDialogVisible"
    @updateUserData="
      (userCode) => {
        userTaskForm.candidateUsers = userCode
        updateElementTask('candidateUsers')
      }
    "
  />
  <role-dialog
    ref="candidateGroupsDialog"
    :single="false"
    v-model:modelValue="candidateGroupsDialogVisible"
    @updateRoleData="
      (roleCode) => {
        userTaskForm.candidateGroups = roleCode
        updateElementTask('candidateGroups')
      }
    "
  />
</template>

<script>
import UserDialog from './components/UserDialog.vue'
import RoleDialog from './components/RoleDialog.vue'
import { Search } from '@element-plus/icons-vue'

export default {
  name: 'UserTask',
  computed: {
    Search() {
      return Search
    },
  },
  components: { UserDialog, RoleDialog },
  props: {
    id: String,
    type: String,
  },
  data() {
    return {
      defaultTaskForm: {
        assignee: '',
        candidateUsers: [],
        candidateGroups: [],
        dueDate: '',
        followUpDate: '',
        priority: '',
      },
      userTaskForm: {},
      assigneeUserDialogVisible: false,
      candidateUserDialogVisible: false,
      candidateGroupsDialogVisible: false,
      // mockData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    }
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.bpmnElement = window.bpmnInstances.bpmnElement
        this.$nextTick(() => this.resetTaskForm())
      },
    },
  },
  methods: {
    resetTaskForm() {
      for (let key in this.defaultTaskForm) {
        let value
        if (key === 'candidateUsers' || key === 'candidateGroups') {
          value = this.bpmnElement?.businessObject[key] ? this.bpmnElement.businessObject[key].split(',') : []
        } else {
          value = this.bpmnElement?.businessObject[key] || this.defaultTaskForm[key]
        }
        this.userTaskForm[key] = value
      }
    },
    updateElementTask(key) {
      const taskAttr = Object.create(null)
      if (key === 'candidateUsers' || key === 'candidateGroups') {
        taskAttr[key] = this.userTaskForm[key] && this.userTaskForm[key].length ? this.userTaskForm[key].join() : null
      } else {
        taskAttr[key] = this.userTaskForm[key] || null
      }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, taskAttr)
    },
  },
  beforeUnmount() {
    this.bpmnElement = null
  },
}
</script>
