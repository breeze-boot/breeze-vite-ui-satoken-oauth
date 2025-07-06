<script lang="ts" setup>
import { defineAsyncComponent, nextTick, ref, shallowRef } from 'vue'
import ProcessViewer from '@/components/ProcessViewer/index.vue'
import UserDialog from '@/components/BpmUserDialog/index.vue'
import { getBpmDefinitionXml } from '@/api/bpm/def/definition'
import { suspendedInstance } from '@/api/bpm/def/instance'
import {
  abolition,
  agree,
  claim,
  delegateTask,
  getFlowButtonInfo,
  getTaskInfo,
  listFlowApproveInfo,
  reject,
  resolveTask,
  transferTask,
  unClaim,
} from '@/api/bpm/task/todo'
import { ElMessage } from 'element-plus'
import { Button } from '@/types/types.ts'
import useUserStore from '@/store/modules/user'
import { ApproveListRecord, TodoRecord } from '@/api/bpm/task/todo/type.ts'
import { useI18n } from 'vue-i18n'
import SvgButton from '@/components/SvgButton/index.vue'
import { useCloseTab } from '@/hooks/newTab'
import { useRouter } from 'vue-router'

const $emit = defineEmits(['approveClickCallBack'])
const props = defineProps({
  procDefKey: {
    type: String,
    default: '',
  },
})

const { t } = useI18n()
let $router = useRouter()
let loading = ref(false)
let formComponent = shallowRef()
let delegateUserDialogVisible = ref<boolean>()
let transferUserDialogVisible = ref<boolean>()
let taskInfo = ref<TodoRecord>({
  applyUser: '',
  applyUserName: '',
  businessKey: '',
  delegationState: '',
  owner: '',
  procDefId: '',
  procDefKey: '',
  procInstId: '',
  taskId: '',
  version: 0,
})
const btnLoading = ref<boolean>(false)
const buttons = ref<Button[]>([])
const startUser = ref<string>()
const xmlStr = ref<string>('')
const processViewerVisible = ref<boolean>(false)
const xmlNodes = ref<any>()
const tableData = ref<ApproveListRecord[]>([])
const userStore = useUserStore()

const initApprove = async (taskId: string) => {
  try {
    if (!taskId) return
    loading.value = true
    const response: any = await getTaskInfo(taskId)
    taskInfo.value = response.data
    await flowButtonInfo()
    await approveList()

    formComponent.value = defineAsyncComponent(() => {
      return import(`/src/views${/* @vite-ignore */ taskInfo.value.formKey as string}.vue`)
    })
  } catch (err: any) {
    loading.value = false
    ElMessage.warning(err.message)
    throw new Error(err.message)
  }
  loading.value = false
}

const initStartApprove = async (procDefKey: string, businessKey: string) => {
  await flowStartButtonInfo(procDefKey, businessKey)
}

/**
 * 获取流程的按钮信息
 */
const flowButtonInfo = async () => {
  try {
    const response: any = await getFlowButtonInfo(
      taskInfo.value.procDefKey,
      taskInfo.value.businessKey,
      taskInfo.value.procInstId,
    )
    await nextTick(() => {
      buttons.value = response.data.buttons
      startUser.value = response.data.startUser
    })
  } catch (err: any) {
    ElMessage.warning(err.message)
    throw new Error(err.message)
  }
}

/**
 * 获取流程的按钮信息
 */
const flowStartButtonInfo = async (procDefKey: string, businessKey: string) => {
  try {
    if (!procDefKey) {
      procDefKey = props.procDefKey
    }
    const response: any = await getFlowButtonInfo(procDefKey, businessKey, '')
    await nextTick(() => {
      buttons.value = response.data.buttons
      startUser.value = response.data.startUser
    })
  } catch (err: any) {
    ElMessage.warning(err.message)
    throw new Error(err.message)
  }
}

/**
 * 获取信息
 */
const historyProcessDefinitionXml = async () => {
  if (!taskInfo.value.procDefKey) {
    taskInfo.value.procDefKey = props.procDefKey
  }
  try {
    const response: any = await getBpmDefinitionXml(taskInfo.value.procDefKey, taskInfo.value.version)
    xmlStr.value = response.data.xmlStr
    xmlNodes.value = response.data
  } catch (err: any) {
    ElMessage.warning(err.message)
    throw new Error(err.message)
  }
}

/**
 * 获取审批记录信息
 */
const approveList = async () => {
  try {
    const response: any = await listFlowApproveInfo(taskInfo.value.procDefKey, taskInfo.value.businessKey)
    tableData.value = response.data
  } catch (err: any) {
    ElMessage.warning(err.message)
    throw new Error(err.message)
  }
}

/**
 * 加签审批通过
 */
const approveResolveTask = async () => {
  try {
    btnLoading.value = true
    const response: any = await resolveTask(taskInfo.value.taskId)
    if (response.code !== '0000') {
      ElMessage.warning('审批失败')
    }
    await flowButtonInfo()
    await useCloseTab($router)
  } catch (err: any) {
    ElMessage.warning(err.message)
    throw new Error(err.message)
  } finally {
    btnLoading.value = false
  }
}

/**
 * 审批通过
 */
const approveAgree = async () => {
  try {
    btnLoading.value = true
    await agree({
      comment: '同意',
      pass: true,
      procInstId: taskInfo.value.procInstId,
      taskId: taskInfo.value.taskId,
      variables: {},
    })
    await flowButtonInfo()
    await useCloseTab($router)
  } catch (err: any) {
    ElMessage.warning(err.message)
    throw new Error(err.message)
  } finally {
    btnLoading.value = false
  }
}

/**
 * 审批废止
 */
const approveAbolition = async () => {
  try {
    btnLoading.value = true
    await abolition({
      comment: '废止流程',
      pass: true,
      procInstId: taskInfo.value.procInstId,
      taskId: taskInfo.value.taskId,
      variables: {},
    })
    await flowButtonInfo()
    await useCloseTab($router)
  } catch (err: any) {
    ElMessage.warning(err.message)
    throw new Error(err.message)
  } finally {
    btnLoading.value = false
  }
}

/**
 * 审批据绝
 */
const approveReject = async () => {
  try {
    btnLoading.value = true
    await reject({
      comment: '拒绝',
      pass: false,
      procInstId: taskInfo.value.procInstId,
      taskId: taskInfo.value.taskId,
      variables: {},
    })
    await flowButtonInfo()
    await useCloseTab($router)
  } catch (err: any) {
    ElMessage.warning(err.message)
    throw new Error(err.message)
  } finally {
    btnLoading.value = false
  }
}

/**
 * 签收
 */
const approveClaim = async () => {
  try {
    btnLoading.value = true
    await claim(taskInfo.value.taskId)
    await flowButtonInfo()
    await useCloseTab($router)
  } catch (err: any) {
    ElMessage.warning(err.message)
    throw new Error(err.message)
  } finally {
    btnLoading.value = false
  }
}

/**
 * 反签收
 */
const approveUnClaim = async () => {
  try {
    btnLoading.value = true
    await unClaim(taskInfo.value.taskId)
    await flowButtonInfo()
    await useCloseTab($router)
  } catch (err: any) {
    ElMessage.warning(err.message)
    throw new Error(err.message)
  } finally {
    btnLoading.value = false
  }
}

/**
 * 加签
 */
const approveDelegateTask = async (row: any) => {
  if (!row.id) {
    ElMessage.warning('用户信息获取失败')
    return
  }
  try {
    btnLoading.value = true
    await delegateTask(taskInfo.value.taskId, row.id)
    await flowButtonInfo()
    await useCloseTab($router)
  } catch (err: any) {
    ElMessage.warning(err.message)
    throw new Error(err.message)
  } finally {
    btnLoading.value = false
  }
}

/**
 * 加签审批
 */
const handleApproveDelegateTask = async () => {
  delegateUserDialogVisible.value = true
}

/**
 * 暂停
 */
const approveSuspendedInstance = async () => {
  btnLoading.value = true
  try {
    await suspendedInstance({
      procInstId: taskInfo.value.procInstId,
    })
    await flowButtonInfo()
    await useCloseTab($router)
  } catch (err: any) {
    ElMessage.warning(err.message)
    throw new Error(err.message)
  } finally {
    btnLoading.value = false
  }
}

/**
 * 转签审批
 */
const approveTransferTask = async (row: any) => {
  if (!row.id) {
    ElMessage.warning('用户信息获取失败')
    return
  }
  try {
    btnLoading.value = true
    await transferTask(taskInfo.value.taskId, row.id)
    await flowButtonInfo()
    await useCloseTab($router)
  } catch (err: any) {
    ElMessage.warning(err.message)
    throw new Error(err.message)
  } finally {
    btnLoading.value = false
  }
}

/**
 * 转签
 */
const handleApproveTransferTask = async () => {
  transferUserDialogVisible.value = true
}

const handleShowBpmFlow = async () => {
  await historyProcessDefinitionXml()
  processViewerVisible.value = true
}

const handleApproveClick = (item: Button) => {
  switch (item.key) {
    case 'abolition':
      approveAbolition()
      break
    case 'agree':
      if (taskInfo.value.delegationState === 'PENDING') {
        approveResolveTask()
      } else {
        approveAgree()
      }
      break
    case 'reject':
      approveReject()
      break
    case 'claim':
      approveClaim()
      break
    case 'unClaim':
      approveUnClaim()
      break
    case 'transfer':
      handleApproveTransferTask()
      break
    case 'delegateTask':
      handleApproveDelegateTask()
      break
    case 'suspended':
      approveSuspendedInstance()
      break
  }
  $emit('approveClickCallBack', item)
}

const tableRowClassName = ({ rowIndex }: { row: ApproveListRecord; rowIndex: number }) => {
  if (rowIndex === 1) {
    return 'warning-row'
  } else if (rowIndex === 3) {
    return 'success-row'
  }
  return ''
}

defineExpose({ initApprove, initStartApprove })
</script>
<template>
  <el-card shadow="never" v-loading="loading">
    <div class="flex items-center">
      <slot name="btn" />
      <template v-for="item in buttons" :key="item.key">
        <template v-if="item.key === 'abolition'">
          <svg-button
            type="primary"
            :label="item.name"
            :loading="btnLoading"
            v-if="startUser === userStore.userInfo.username"
            @svg-btn-click="handleApproveClick(item)"
          />
        </template>
        <template v-else>
          <svg-button
            type="primary"
            :label="item.name"
            :loading="btnLoading"
            @svg-btn-click="handleApproveClick(item)"
          />
        </template>
      </template>
      <svg-button type="primary" label="流程图" @svg-btn-click="handleShowBpmFlow" />
    </div>
    <el-divider />
    <el-row>
      <!--组件插槽-->
      <el-col :span="24" style="padding: 20px">
        <el-card shadow="never">
          <component v-model="taskInfo.businessKey" v-if="formComponent" :is="formComponent" />
          <slot v-else name="form" />
        </el-card>
      </el-col>
      <!--流程信息-->
      <el-col :span="24" style="padding: 20px">
        <el-card shadow="never">
          <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column prop="taskName" label="任务名" />
            <el-table-column prop="activityId" label="节点" />
            <el-table-column prop="assigneeName" label="当前审批人" />
            <el-table-column prop="taskAssigneeName" label="任务分配人员" />
            <el-table-column prop="taskCandidateName" label="任务审批候选人员" />
            <el-table-column prop="taskGroupName" label="任务审批候选角色" />
            <el-table-column prop="startTime" label="审批开始时间" />
            <el-table-column prop="endTime" label="审批结束时间" />
            <el-table-column prop="comments" label="审批意见">
              <template v-slot="{ row }">
                <div v-if="row.comments">
                  <div v-for="(item, index) in row.comments" :key="index">
                    <div style="border-bottom: 1px solid rgb(40 40 40 / 23%)">{{ item.message }}</div>
                    <div style="border-bottom: 1px solid rgb(40 40 40 / 23%)">{{ item.time }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </el-card>

  <!--流程信息-->
  <el-dialog v-model="processViewerVisible">
    <process-viewer :xml="xmlStr" style="width: 100%; height: 50vh" :xmlNodes="xmlNodes" />
  </el-dialog>

  <user-dialog
    ref="transferUserRef"
    :title="t('bpmn.fields.userList')"
    :single="true"
    v-model:modelValue="transferUserDialogVisible"
    @updateUserData="
      (row: any) => {
        approveTransferTask(row)
      }
    "
  />
  <user-dialog
    ref="delegateUserRef"
    :title="t('bpmn.fields.userList')"
    :single="true"
    v-model:modelValue="delegateUserDialogVisible"
    @updateUserData="
      (row: any) => {
        approveDelegateTask(row)
      }
    "
  />
</template>
<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.example-showcase .el-loading-mask {
  z-index: 9;
}
</style>
