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
import { useMessage } from '@/hooks/message'
import { useI18n } from 'vue-i18n'

const tenantIdOption = ref<SelectData[]>()
let { tenantId } = storeToRefs(useUserStore())
let _tenantId = ref<number>()
const settingStore = useSettingStore()
const { t } = useI18n()
const $message = useMessage()

onMounted(async () => {
  await initTenant()
})

/**
 * 初始化租户下拉框
 */
const initTenant = async () => {
  try {
    const response: any = await selectTenant()
    tenantIdOption.value = response.data
    _tenantId.value = tenantId.value as any
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
}

const handleChangeTenant = () => {
  useUserStore().storeTenantId(_tenantId.value as number)
  updateRefresh()
}

/**
 * 刷新
 */
const updateRefresh = () => {
  settingStore.refresh = !settingStore.refresh
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
