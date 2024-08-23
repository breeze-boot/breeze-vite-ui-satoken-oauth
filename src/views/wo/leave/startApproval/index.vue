<!--
 * @author: gaoweixuan
 * @since: 2024-08-11
-->

<!-- 待办任务审批 -->
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Button } from '@/types/types.ts'
import { useI18n } from 'vue-i18n'
import { addLeave, editLeave } from '@/api/wo/leave'
import { ElMessage } from 'element-plus'
import { LeaveForm } from '@/api/wo/leave/type.ts'
import ProcessTask from '@/components/ProcessTask/index.vue'

defineOptions({
  name: 'LeaveApproval',
  inheritAttrs: false,
})

const todoTaskRef = ref()

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const leaveDataFormRef = ref()
const leaveDataForm = ref<LeaveForm>({ id: 0, code: '', endDate: '', reason: '', startDate: '', title: '' })
const rules = ref({})

onMounted(async () => {
  await todoTaskRef.value.initStartApprove('leave', leaveDataForm.value.code as string)
})

/**
 * 表单提交
 */
const handleDataFormSubmit = () => {
  leaveDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = leaveDataForm.value.id
    if (id) {
      await editLeave(leaveDataForm.value)
      ElMessage.success({
        message: t('common.success'),
        duration: 500,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addLeave(leaveDataForm.value)
      ElMessage.success({
        message: t('common.success'),
        duration: 500,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    }
  })
}

/**
 * 获取流程的按钮信息
 */
const approveClickCallBack = (item: Button) => {
  console.log(item)
  handleDataFormSubmit()
}
</script>

<template>
  <process-task ref="todoTaskRef" @approveClickCallBack="approveClickCallBack">
    <template v-slot:formSlot>
      <el-form
        :model="leaveDataForm"
        :rules="rules"
        ref="leaveDataFormRef"
        @keyup.enter="handleDataFormSubmit()"
        label-width="120px"
      >
        <el-form-item :label="t('leave.fields.title')">
          <el-input v-model="leaveDataForm.title" />
        </el-form-item>
        <el-form-item :label="t('leave.fields.code')">
          <el-input v-model="leaveDataForm.code" />
        </el-form-item>
        <el-form-item :label="t('leave.fields.startDate')">
          <el-date-picker v-model="leaveDataForm.startDate" type="date" placeholder="" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="t('leave.fields.endDate')">
          <el-date-picker v-model="leaveDataForm.endDate" type="date" placeholder="" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="t('leave.fields.reason')">
          <el-input v-model="leaveDataForm.reason" type="textarea" />
        </el-form-item>
      </el-form>
    </template>
  </process-task>
</template>
