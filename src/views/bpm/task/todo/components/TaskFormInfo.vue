<template>
  <el-descriptions title="Customized style list" :column="3" border>
    <el-descriptions-item
      label="Username"
      label-align="right"
      align="center"
      label-class-name="my-label"
      class-name="my-content"
      width="150px"
    >
      kooriookami
    </el-descriptions-item>
    <el-descriptions-item label="Telephone" label-align="right" align="center">18100000000</el-descriptions-item>
    <el-descriptions-item label="Place" label-align="right" align="center">Suzhou</el-descriptions-item>
    <el-descriptions-item label="Remarks" label-align="right" align="center">
      <el-tag size="small">School</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="Address" label-align="right" align="center">
      No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const $emit = defineEmits(['update:modelValue'])
const businessKey = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    $emit('update:modelValue', value)
  },
})
ElMessage.success(businessKey.value + '初始化')
</script>

<style scoped>
:deep(.my-label) {
  background: var(--el-color-success-light-9) !important;
}

:deep(.my-content) {
  background: var(--el-color-danger-light-9);
}
</style>
