/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { defineStore } from 'pinia'
import { SettingState } from '@/store/modules/types/types.ts'
import setting from '@/setting.ts'
import { MenuLayout, Settings, Theme } from '@/types/types.ts'
import { CookiesKey, CookiesStorage } from '@/utils/cookies.ts'
import { DEVICE, LAYOUT } from '@/utils/common.ts'

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
        lightFont: setting.defaultLightFont,
        darkFont: setting.defaultDarkFont,
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
    setMenuLayout(value: MenuLayout) {
      this.theme.menuLayout = value
      CookiesStorage.set(CookiesKey.MENU_LAYOUT, value)
    },
    setDevice(device: string) {
      this.device = device
      CookiesStorage.set(CookiesKey.DEVICE, device)
      if (device === DEVICE.MOBILE) {
        this.settings.isCollapse = true
        this.setMenuLayout(LAYOUT.VERTICAL)
      } else if (device === DEVICE.PAD) {
        this.setMenuLayout(LAYOUT.VERTICAL)
        this.settings.isCollapse = true
      } else if (device === DEVICE.PC) {
        this.setMenuLayout(this.theme.menuLayout)
        this.settings.isCollapse = false
      }
    },
  },
})

export default useSettingStore
