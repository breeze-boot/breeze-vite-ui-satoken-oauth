<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { listFlowApproveInfo } from '@/api/bpm/task/todo'
import { ApproveListRecord } from '@/api/bpm/task/todo/type.ts'
import { ElMessage } from 'element-plus'

const props = defineProps({
  procDefKey: {
    type: String,
    default: '',
  },
  businessKey: {
    type: String,
    default: '',
  },
})

const tableData = ref<ApproveListRecord[]>([])

onMounted(() => {
  approveList()
})

/**
 * 获取审批记录信息
 */
const approveList = async () => {
  const response: any = await listFlowApproveInfo(props.procDefKey, props.businessKey)
  if (response.code !== '0000') {
    ElMessage.warning('审批记录获取失败')
    return
  }
  tableData.value = response.data
}

const tableRowClassName = ({ rowIndex }: { row: ApproveListRecord; rowIndex: number }) => {
  if (rowIndex === 1) {
    return 'warning-row'
  } else if (rowIndex === 3) {
    return 'success-row'
  }
  return ''
}
</script>
<template>
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
            <div style="border-bottom: 1px solid rgba(40, 40, 40, 0.23)">{{ item.message }}</div>
            <div style="border-bottom: 1px solid rgba(40, 40, 40, 0.23)">{{ item.time }}</div>
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
