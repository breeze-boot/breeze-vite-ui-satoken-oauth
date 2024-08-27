<script lang="ts" setup>
import { defineAsyncComponent, nextTick, ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import ProcessViewer from '@/components/ProcessViewer/index.vue'
import BpmInfo from '@/components/ProcessTask/ProcessInfo/index.vue'
import UserDialog from '@/components/UserDialog/index.vue'
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

const $emit = defineEmits(['approveClickCallBack'])

const { t } = useI18n()
let form = shallowRef()
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
})
const $router = useRouter()
const loading = ref<boolean>(false)
const btnLoading = ref<boolean>(false)
const tabName = ref<string>('approval')
const buttons = ref<Button[]>([])
const startUser = ref<string>()
const xmlStr = ref<string>('')
const xmlNodes = ref<any>()
const tableData = ref<ApproveListRecord[]>([])
const userStore = useUserStore()

const initApprove = async (taskId: string) => {
  const response: any = await getTaskInfo(taskId)
  if (response.code !== '0000') {
    ElMessage.warning('任务不存在')
  }
  taskInfo.value = response.data
  await flowButtonInfo()

  form.value = defineAsyncComponent(() => {
    return import(`/src/views${/* @vite-ignore */ taskInfo.value.formKey as string}.vue`)
  })
}

const initStartApprove = async (procDefKey: string, businessKey: string) => {
  await flowStartButtonInfo(procDefKey, businessKey)
}

/**
 * 获取信息
 */
const handleChangeType = async (value: string) => {
  await flowButtonInfo()
  if (value === 'approval') {
    tabName.value = value
    return
  }
  if (value === 'approvalNode') {
    await approveList()
    tabName.value = value
    return
  }
  if (value === 'flow') {
    await historyProcessDefinitionXml()
    tabName.value = value
    return
  }
}
/**
 * 获取流程的按钮信息
 */
const flowButtonInfo = async () => {
  const response: any = await getFlowButtonInfo(
    taskInfo.value.procDefKey,
    taskInfo.value.businessKey,
    taskInfo.value.procInstId,
  )
  if (response.code !== '0000') {
    ElMessage.warning('按钮获取失败')
    return
  }
  nextTick(() => {
    buttons.value = response.data.buttons
    startUser.value = response.data.startUser
  })
}

/**
 * 获取流程的按钮信息
 */
const flowStartButtonInfo = async (procDefKey: string, businessKey: string) => {
  const response: any = await getFlowButtonInfo(procDefKey, businessKey, '')
  if (response.code !== '0000') {
    ElMessage.warning('按钮获取失败')
    return
  }
  nextTick(() => {
    buttons.value = response.data.buttons
    startUser.value = response.data.startUser
  })
}

/**
 * 获取信息
 */
const historyProcessDefinitionXml = async () => {
  if (!taskInfo.value.procInstId) return
  const response: any = await getBpmDefinitionXml(taskInfo.value.procInstId)
  if (response.code !== '0000') {
    ElMessage.warning('流程图获取失败')
    return
  }
  xmlStr.value = response.data.xmlStr
  xmlNodes.value = response.data
}

/**
 * 获取审批记录信息
 */
const approveList = async () => {
  const response: any = await listFlowApproveInfo(taskInfo.value.procDefKey, taskInfo.value.businessKey)
  if (response.code !== '0000') {
    ElMessage.warning('审批记录获取失败')
    return
  }
  tableData.value = response.data
}

/**
 * 加签审批通过
 */
const approveResolveTask = async () => {
  const response: any = await resolveTask(taskInfo.value.taskId)
  if (response.code !== '0000') {
    ElMessage.warning('审批失败')
  }
  await flowButtonInfo()
  btnLoading.value = false
}

/**
 * 审批通过
 */
const approveAgree = async () => {
  const response: any = await agree({
    comment: '同意',
    pass: true,
    procInstId: taskInfo.value.procInstId,
    taskId: taskInfo.value.taskId,
    variables: {},
  })
  if (response.code !== '0000') {
    ElMessage.warning('审批失败')
  }
  await flowButtonInfo()
  btnLoading.value = false
}

/**
 * 审批废止
 */
const approveAbolition = async () => {
  const response: any = await abolition({
    comment: '废止流程',
    pass: true,
    procInstId: taskInfo.value.procInstId,
    taskId: taskInfo.value.taskId,
    variables: {},
  })
  if (response.code !== '0000') {
    ElMessage.warning('审批失败')
  }
  await flowButtonInfo()
  btnLoading.value = false
}

/**
 * 审批据绝
 */
const approveReject = async () => {
  const response: any = await reject({
    comment: '拒绝',
    pass: false,
    procInstId: taskInfo.value.procInstId,
    taskId: taskInfo.value.taskId,
    variables: {},
  })
  if (response.code !== '0000') {
    ElMessage.warning('审批失败')
  }
  await flowButtonInfo()
  btnLoading.value = false
}

/**
 * 签收
 */
const approveClaim = async () => {
  const response: any = await claim(taskInfo.value.taskId)
  if (response.code !== '0000') {
    ElMessage.warning('签收失败')
  }
  await flowButtonInfo()
  await handleChangeType(tabName.value)
  btnLoading.value = false
}

/**
 * 反签收
 */
const approveUnClaim = async () => {
  const response: any = await unClaim(taskInfo.value.taskId)
  if (response.code !== '0000') {
    ElMessage.warning('签收失败')
  }
  await flowButtonInfo()
  await handleChangeType(tabName.value)
  btnLoading.value = false
}

/**
 * 加签
 */
const approveDelegateTask = async (username: string) => {
  const response: any = await delegateTask(taskInfo.value.taskId, username)
  if (response.code !== '0000') {
    ElMessage.warning('加签失败')
  }
  await flowButtonInfo()
  await handleChangeType(tabName.value)
  btnLoading.value = false
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
  const response: any = await suspendedInstance({
    procInstId: taskInfo.value.procInstId,
  })
  if (response.code !== '0000') {
    ElMessage.warning('暂停失败')
  }
  await flowButtonInfo()
  await handleChangeType(tabName.value)
  btnLoading.value = false
}

/**
 * 转签审批
 */
const approveTransferTask = async (username: string) => {
  const response: any = await transferTask(taskInfo.value.taskId, username)
  if (response.code !== '0000') {
    ElMessage.warning('审批失败')
  }
  await flowButtonInfo()
  await handleChangeType(tabName.value)
  btnLoading.value = false
}

/**
 * 转签
 */
const handleApproveTransferTask = async () => {
  transferUserDialogVisible.value = true
}

const handleApproveClick = (item: Button) => {
  btnLoading.value = true
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

const goBack = () => {
  $router.back()
}

defineExpose({ initApprove, initStartApprove })
</script>
<template>
  <el-card shadow="never">
    <el-page-header style="width: 100%" :icon="ArrowLeft" @back="goBack">
      <template #content>
        <div class="flex items-center">
          <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">流程处理</span>
        </div>
      </template>
      <template #extra>
        <div class="flex items-center">
          <template v-for="item in buttons" :key="item.key">
            <template v-if="item.key === 'abolition'">
              <svg-button
                type="primary"
                class="ml-2"
                :label="item.name"
                :loading="btnLoading"
                v-if="startUser === userStore.userInfo.username"
                @svg-btn-click="handleApproveClick(item)"
              />
            </template>
            <template v-else>
              <svg-button
                type="primary"
                class="ml-2"
                :label="item.name"
                :loading="btnLoading"
                @svg-btn-click="handleApproveClick(item)"
              />
            </template>
          </template>
        </div>
      </template>
      <el-divider />
      <div class="mt-4 text-sm font-bold">
        <el-skeleton v-if="loading" :rows="5" animated />

        <el-radio-group @change="handleChangeType" size="default" style="margin-bottom: 30px">
          <el-radio-button value="approval">审批</el-radio-button>
          <el-radio-button value="approvalNode">审批记录</el-radio-button>
          <el-radio-button value="flow">流程图</el-radio-button>
        </el-radio-group>
        <el-row v-if="tabName === 'approval'" :gutter="23">
          <el-col :span="23">
            <component v-model="taskInfo.businessKey" v-if="form" :is="form" />
            <slot v-else name="formSlot" />
          </el-col>
        </el-row>
        <el-row v-if="tabName === 'approvalNode'" :gutter="23">
          <bpm-info :business-key="taskInfo.businessKey" :proc-def-key="taskInfo.procDefKey" />
        </el-row>
        <el-row v-if="tabName === 'flow'" :gutter="23">
          <el-col :span="23" style="overflow-x: hidden">
            <process-viewer :xml="xmlStr" style="height: 50vh; width: 100%" :xmlNodes="xmlNodes" />
          </el-col>
        </el-row>
      </div>
    </el-page-header>
  </el-card>

  <user-dialog
    ref="transferUserRef"
    :title="t('bpmn.fields.userList')"
    :single="true"
    v-model:modelValue="transferUserDialogVisible"
    @updateUserData="
      (username: string) => {
        approveTransferTask(username)
      }
    "
  />
  <user-dialog
    ref="delegateUserRef"
    :title="t('bpmn.fields.userList')"
    :single="true"
    v-model:modelValue="delegateUserDialogVisible"
    @updateUserData="
      (username: string) => {
        approveDelegateTask(username)
      }
    "
  />
</template>
<style></style>
