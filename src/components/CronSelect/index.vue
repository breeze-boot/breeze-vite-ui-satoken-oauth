<!--
 * @author: gaoweixuan
 * @since: 2024-02-25
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import NoVue3Cron from '@/components/NoVue3Cron/index.vue'
import useSettingStore from '@/store/modules/setting.ts'
import { LANGUAGE } from '@/utils/common.ts'

defineOptions({
  name: 'CronSelect',
  inheritAttrs: false,
})
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
})

const cronPopover = ref<boolean>()
const settings = useSettingStore().settings

/**
 * 当前语言
 */
const language = computed(() => {
  return settings.language === LANGUAGE.ZH_CN ? 'cn' : LANGUAGE.EN
})

const $emit = defineEmits(['update:modelValue'])
const cron = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    $emit('update:modelValue', value)
  },
})

/**
 * 切换事件
 *
 * @param value
 */
const changeCron = (value: any) => {
  if (typeof value !== 'string') return false
  cron.value = value
  cronPopover.value = false
}
</script>

<template>
  <el-popover placement="bottom" v-model:visible="cronPopover" :width="530" trigger="click">
    <template #reference>
      <el-input :placeholder="props.placeholder" :value="cron" style="margin-right: 16px; width: 530px" />
    </template>

    <no-vue3-cron
      :cron-value="cron"
      @change="changeCron"
      @close="cronPopover = false"
      max-height="400px"
      :i18n="language"
    />
  </el-popover>
</template>
