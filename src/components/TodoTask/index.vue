<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import ProcessViewer from '@/components/ProcessViewer/index.vue'
import BpmInfo from '@/components/TodoTask/bpmInfo/index.vue'
import { getBpmDefinitionXml } from '@/api/bpm/def/definition'
import { suspendedInstance } from '@/api/bpm/def/instance'
import {
  agree,
  reject,
  resolveTask,
  claim,
  unClaim,
  listFlowApproveInfo,
  getFlowButtonInfo,
  delegateTask,
  transferTask,
  abolition,
} from '@/api/bpm/task/todo'
import { ElMessage } from 'element-plus'
import { Button } from '@/types/types.ts'
import useUserStore from '@/store/modules/user'
import { ApproveListRecord } from '@/api/bpm/task/todo/type.ts'

const props = defineProps({
  taskInfo: {
    type: Object<any>,
    default: () => {},
  },
  buttons: {
    type: Array<Button>,
    default: () => [],
  },
})
const $emit = defineEmits(['approveClickCallBack', 'update:buttons', 'update:startUser'])
const userStore = useUserStore()

const $router = useRouter()
const loading = ref<boolean>(false)
const btnLoading = ref<boolean>(false)
const tabName = ref<string>('approval')
const xmlStr = ref<string>('')
const xmlNodes = ref<any>({})
const tableData = ref<ApproveListRecord[]>([])

/**
 * 获取信息
 */
const handleChangeType = async (value: string) => {
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
const taskButton = computed({
  get: () => {
    return props.buttons
  },
  set: (value) => {
    $emit('update:buttons', value)
  },
})

/**
 * 获取信息
 */
const historyProcessDefinitionXml = async () => {
  if (!props.taskInfo.procInstId) return
  const response: any = await getBpmDefinitionXml(props.taskInfo.procInstId)
  if (response.code !== '0000') {
    ElMessage.warning('流程图获取失败')
    return
  }
  xmlStr.value = response.data.xmlStr
  xmlNodes.value = response.data
}

/**
 * 获取流程的按钮信息
 */
const flowButtonInfo = async () => {
  const response: any = await getFlowButtonInfo(
    props.taskInfo.procDefKey,
    props.taskInfo.businessKey,
    props.taskInfo.procInstId,
  )
  if (response.code !== '0000') {
    ElMessage.warning('按钮获取失败')
    return
  }
  taskButton.value = response.data.buttons
}

/**
 * 获取审批记录信息
 */
const approveList = async () => {
  const response: any = await listFlowApproveInfo(props.taskInfo.procDefKey, props.taskInfo.businessKey)
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
  const response: any = await resolveTask(props.taskInfo.taskId)
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
    procInstId: props.taskInfo.procInstId,
    taskId: props.taskInfo.taskId,
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
    procInstId: props.taskInfo.procInstId,
    taskId: props.taskInfo.taskId,
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
    procInstId: props.taskInfo.procInstId,
    taskId: props.taskInfo.taskId,
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
  const response: any = await claim(props.taskInfo.taskId)
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
  const response: any = await unClaim(props.taskInfo.taskId)
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
const approveDelegateTask = async () => {
  const response: any = await delegateTask(props.taskInfo.taskId, 'user4')
  if (response.code !== '0000') {
    ElMessage.warning('加签失败')
  }
  await flowButtonInfo()
  await handleChangeType(tabName.value)
  btnLoading.value = false
}

/**
 * 暂停
 */
const approveSuspendedInstance = async () => {
  const response: any = await suspendedInstance({
    procInstId: props.taskInfo.procInstId,
  })
  if (response.code !== '0000') {
    ElMessage.warning('暂停失败')
  }
  await flowButtonInfo()
  await handleChangeType(tabName.value)
  btnLoading.value = false
}

/**
 * 转签
 */
const approveTransferTask = async () => {
  const response: any = await transferTask(props.taskInfo.taskId, 'user4')
  if (response.code !== '0000') {
    ElMessage.warning('审批失败')
  }
  await flowButtonInfo()
  await handleChangeType(tabName.value)
  btnLoading.value = false
}

const handleApproveClick = (item: Button) => {
  btnLoading.value = true
  switch (item.key) {
    case 'abolition':
      approveAbolition()
      break
    case 'agree':
      if (props.taskInfo.delegationState === 'PENDING') {
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
      approveTransferTask()
      break
    case 'delegateTask':
      approveDelegateTask()
      break
    case 'suspended':
      debugger
      approveSuspendedInstance()
      break
  }
  $emit('approveClickCallBack', item)
}

const goBack = () => {
  $router.back()
}

defineExpose({})
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
          <template v-for="item in taskButton" :key="item.key">
            <template v-if="item.key === 'abolition'">
              <svg-button
                type="primary"
                class="ml-2"
                :label="item.name"
                :loading="btnLoading"
                v-if="taskInfo.startUser != userStore.userInfo.username"
                @svg-btn-click="handleApproveClick(item)"
              />
            </template>
            <template v-else>
              <svg-button
                type="primary"
                class="ml-2"
                :label="item.name"
                :loading="btnLoading"
                v-if="taskInfo.startUser != userStore.userInfo.username"
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
            <slot name="formSlot" />
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
</template>
<style></style>
