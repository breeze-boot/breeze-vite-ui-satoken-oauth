<!--
 * @author: gaoweixuan
 * @since: 2024-01-31
-->
<script setup lang="ts" name="settingsDrawer">
import { onMounted, ref, watch } from 'vue'
import useSettingStore from '@/store/modules/setting.ts'
import { Setting } from '@element-plus/icons-vue'
import navStyle from './navStyle/index.vue'
import { storeToRefs } from 'pinia'

let settingStore = useSettingStore()
let { theme } = storeToRefs(settingStore)
const drawer = ref(false)
const direction = ref('rtl')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

let darkSwitch = ref<string>(theme.value.themeModel)
const themeColorPicker = ref<string>(theme.value.themeColor)

/**
 * 初始化
 */
onMounted(() => {
  changeDark()
  changeThemeColor()
})

/**
 * 打开抽屉
 */
const openSetting = () => {
  drawer.value = true
}

/**
 * 监听方法
 */
watch(
  () => settingStore.device,
  () => {
    drawer.value = false
  },
)

/**
 * 切换日间/夜间模式
 */
const changeDark = () => {
  let html = document.documentElement
  settingStore.setThemeModel(darkSwitch.value)
  if (darkSwitch.value !== 'dark') {
    html.classList.remove('dark')
    return
  }
  html.classList.add('dark')
}

/**
 * 改变主题颜色
 */
const changeThemeColor = () => {
  document.documentElement.style.setProperty('--el-color-primary', themeColorPicker.value)
  settingStore.setThemeColor(themeColorPicker.value)
}
</script>

<template>
  <el-drawer v-model="drawer" :show-close="false" size="20%" :direction="direction">
    <el-form>
      <el-divider>主题颜色</el-divider>
      <el-form-item label="主题颜色">
        <el-color-picker
          v-model="themeColorPicker"
          show-alpha
          :predefine="predefineColors"
          @change="changeThemeColor"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="darkSwitch"
          inline-prompt
          active-value="light"
          inactive-value="dark"
          active-icon="Sunny"
          inactive-icon="MoonNight"
          @change="changeDark"
        />
      </el-form-item>
      <el-divider>导航栏布局</el-divider>
      <el-form-item label="顶部导航栏">
        <nav-style />
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-button style="margin: 0 5px" circle :icon="Setting" @click="openSetting" />
</template>
<style lang="scss" scoped></style>
