<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->

<!-- 请假工单添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addLeave, getLeave, editLeave } from '@/api/wo/leave'
import type { LeaveRecord } from '@/api/wo/leave/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'

defineOptions({
  name: 'LeaveAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const leaveDataFormRef = ref()
const leaveDataForm = ref<LeaveRecord>({})
const rules = ref({})

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  leaveDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (leaveDataFormRef.value) {
    leaveDataFormRef.value.resetFields()
  }
  if (id) {
    await getInfo(id)
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  const response: any = await getLeave(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(leaveDataForm.value, response.data)
  }
}

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

defineExpose({
  init,
})
</script>

<template>
  <el-card>
    <el-form
      :model="leaveDataForm"
      :rules="rules"
      ref="leaveDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="120px"
    >
      <el-form-item :label="$t('leave.fields.title')" prop="title">
        <el-input v-model="leaveDataForm.todoCode" :placeholder="$t('leave.fields.title')" />
      </el-form-item>
    </el-form>
  </el-card>
</template>
