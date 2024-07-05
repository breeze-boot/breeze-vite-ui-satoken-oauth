/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { defineStore } from 'pinia'
import { SettingState } from '@/store/modules/types/types.ts'
import setting from '@/setting.ts'
import { Settings, Theme } from '@/types/types.ts'
import { CookiesKey, CookiesStorage } from '@/utils/cookies.ts'

const useSettingStore = defineStore('SettingStore', {
  state: (): SettingState => {
    return {
      refresh: false,
      device: CookiesStorage.get(CookiesKey.DEVICE) || setting.defaultDevice,
      theme: {
        watermark: setting.defaultEnableWatermark,
        watermarkContent: setting.watermarkContent,
        themeModel: CookiesStorage.get(CookiesKey.THEME_MODEL) || setting.defaultEnableDark,
        menuLayout: CookiesStorage.get(CookiesKey.MENU_LAYOUT) || setting.defaultMenuLayout,
        themeColor: CookiesStorage.get(CookiesKey.THEME_COLOR) || setting.defaultThemeColor,
        size: CookiesStorage.get(CookiesKey.SIZE) || setting.size,
        lightFont: setting.lightFont,
        darkFont: setting.darkFont,
      } as Theme,
      settings: {
        title: setting.title,
        showAvatar: setting.defaultShowAvatar,
        isCollapse: setting.defaultIsCollapse,
        logoHidden: setting.defaultLogoHidden,
        logoUrl: setting.defaultLogoUrl,
        language: CookiesStorage.get(CookiesKey.LANGUAGE) || setting.defaultLanguage,
      } as Settings,
    }
  },
  actions: {
    setSize(value: string) {
      this.theme.size = value
      CookiesStorage.set(CookiesKey.SIZE, value)
    },
    setThemeModel(value: string) {
      this.theme.themeModel = value
      CookiesStorage.set(CookiesKey.THEME_MODEL, value)
    },
    setLanguage(value: string) {
      this.settings.language = value
      CookiesStorage.set(CookiesKey.LANGUAGE, value)
    },
    setThemeColor(value: string) {
      this.theme.themeColor = value
      CookiesStorage.set(CookiesKey.THEME_COLOR, value)
    },
    setMenuLayout(value: string) {
      this.theme.menuLayout = value
      CookiesStorage.set(CookiesKey.MENU_LAYOUT, value)
    },
    setDevice(value: string) {
      this.device = value
      CookiesStorage.set(CookiesKey.DEVICE, value)
    },
  },
})

export default useSettingStore
