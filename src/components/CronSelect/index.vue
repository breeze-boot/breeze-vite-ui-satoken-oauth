<!--
 * @author: gaoweixuan
 * @since: 2024-02-25
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import NoVue3Cron from '@/components/NoVue3Cron/index.vue'
import useSettingStore from '@/store/modules/setting.ts'
const settings = useSettingStore().settings

defineOptions({
  name: 'CronSelect',
  inheritAttrs: false,
})
const props = defineProps({
  cron: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
})

const cronPopover = ref<boolean>()

/**
 * 当前语言
 */
const language = computed(() => {
  return settings.language === 'zhCn' ? 'cn' : 'en'
})

const $emit = defineEmits(['update:cron'])
const cron = computed({
  get: () => {
    return props.cron
  },
  set: (value) => {
    $emit('update:cron', value)
  },
})

/**
 * 切换事件
 *
 * @param val
 */
const changeCron = (val: any) => {
  if (typeof val !== 'string') return false
  cron.value = val
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
