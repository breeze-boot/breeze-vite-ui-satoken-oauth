/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { ref } from 'vue'
import { defineStore, StoreDefinition } from 'pinia'
import { SettingState } from '@/store/modules/types/types.ts'
import setting from '@/setting.ts'
import { MenuLayout, Settings, Theme } from '@/types/types.ts'
import { CookiesKey, CookiesStorage } from '@/utils/cookies.ts'
import { DEVICE, LAYOUT, THEME } from '@/utils/common.ts'

// 初始化状态（从 Cookie 或默认值获取）
const initTheme = (): Theme => {
  return {
    watermark: setting.defaultEnableWatermark,
    watermarkContent: setting.watermarkContent,
    themeModel: CookiesStorage.get(CookiesKey.THEME_MODEL) || setting.defaultEnableDark,
    menuLayout: CookiesStorage.get(CookiesKey.MENU_LAYOUT) || setting.defaultMenuLayout,
    themeColor: CookiesStorage.get(CookiesKey.THEME_COLOR) || setting.defaultThemeColor,
    size: CookiesStorage.get(CookiesKey.SIZE) || setting.size,
    lightFont: setting.defaultLightFont,
    darkFont: setting.defaultDarkFont,
  }
}

const initSettings = (): Settings => {
  return {
    title: setting.title,
    showAvatar: setting.defaultShowAvatar,
    primaryColor: '',
    secondaryColor: '',
    isCollapse: setting.defaultIsCollapse,
    logoHidden: setting.defaultLogoHidden,
    logoUrl: setting.defaultLogoUrl,
    language: CookiesStorage.get(CookiesKey.LANGUAGE) || setting.defaultLanguage,
  }
}

const useSettingStore: StoreDefinition<'SettingStore', SettingState> = defineStore('SettingStore', () => {
  // 响应式状态
  const refresh = ref(false)
  const device = ref<string>(CookiesStorage.get(CookiesKey.DEVICE) || setting.defaultDevice)
  const theme = ref<Theme>(initTheme())
  const settings = ref<Settings>(initSettings())

  // 设置尺寸
  const setSize = (value: string) => {
    theme.value.size = value
    CookiesStorage.set(CookiesKey.SIZE, value)
  }

  // 设置主题模式
  const setThemeModel = (value: string) => {
    theme.value.themeModel = value
    CookiesStorage.set(CookiesKey.THEME_MODEL, value)
  }

  // 设置语言
  const setLanguage = (value: string) => {
    settings.value.language = value
    CookiesStorage.set(CookiesKey.LANGUAGE, value)
  }

  // 设置主题颜色
  const setThemeColor = (value: string) => {
    theme.value.themeColor = value
    CookiesStorage.set(CookiesKey.THEME_COLOR, value)
  }

  // 设置菜单布局
  const setMenuLayout = (value: MenuLayout) => {
    theme.value.menuLayout = value
    CookiesStorage.set(CookiesKey.MENU_LAYOUT, value)
  }

  const isDarkMode = () => {
    return theme.value.themeModel === THEME.DARK
  }

  // 设置设备类型
  const setDevice = (deviceType: string) => {
    device.value = deviceType
    CookiesStorage.set(CookiesKey.DEVICE, deviceType)

    switch (deviceType) {
      case DEVICE.MOBILE:
      case DEVICE.PAD:
        settings.value.isCollapse = true
        setMenuLayout(LAYOUT.VERTICAL)
        break
      case DEVICE.PC:
        settings.value.isCollapse = setting.defaultIsCollapse
        setMenuLayout(theme.value.menuLayout) // 恢复原有布局
        break
      default:
        break
    }
  }

  return {
    // 状态
    refresh,
    device,
    theme,
    settings,

    // 方法
    isDarkMode,
    setSize,
    setThemeModel,
    setLanguage,
    setThemeColor,
    setMenuLayout,
    setDevice,
  }
})

export default useSettingStore
