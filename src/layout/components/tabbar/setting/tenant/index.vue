<!--
 * @author: gaoweixuan
 * @since: 2024-07-14
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { selectTenant } from '@/api/auth/tenant'
import { storeToRefs } from 'pinia'
import useSettingStore from '@/store/modules/setting.ts'
import useUserStore from '@/store/modules/user.ts'
import { SelectData } from '@/types/types.ts'

const tenantIdOption = ref<SelectData[]>()
let { tenantId } = storeToRefs(useUserStore())
let _tenantId = ref<string>('')
let { refresh } = storeToRefs(useSettingStore())

onMounted(async () => {
  await initTenant()
})

/**
 * 初始化租户下拉框
 */
const initTenant = async () => {
  const response: any = await selectTenant()
  if (response.code === '0000') {
    tenantIdOption.value = response.data
    _tenantId.value = tenantId.value.toString()
  }
}

const handleChangeTenant = () => {
  useUserStore().storeTenantId(_tenantId.value)
  updateRefresh()
}

/**
 * 刷新
 */
const updateRefresh = () => {
  refresh.value = !refresh.value
}
</script>

<template>
  <el-select @change="handleChangeTenant" v-model="_tenantId" style="width: 100px" size="small">
    <el-option
      v-for="item in tenantIdOption"
      :key="item.value.toString()"
      :label="item.label"
      :value="item.value.toString()"
    ></el-option>
  </el-select>
</template>
