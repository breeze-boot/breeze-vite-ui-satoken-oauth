import logoUrl from '@/assets/vue.svg'
import { DEVICE, LANGUAGE, LAYOUT, THEME } from '@/utils/common.ts'

/**
 * 用于项目logo | 标题配置
 */
export default {
  title: 'Breeze-Vite-UI',
  defaultIsCollapse: true,
  defaultDevice: DEVICE.PC,
  defaultShowAvatar: false,
  defaultLogoUrl: logoUrl,
  defaultEnableWatermark: true,
  defaultLogoHidden: true,
  defaultMenuLayout: LAYOUT.VERTICAL,
  defaultThemeColor: 'rgb(64, 158, 255)',
  defaultEnableDark: THEME.LIGHT,
  defaultLightFont: {
    color: 'rgba(255, 255, 255, .15)',
  },
  defaultDarkFont: {
    color: 'rgba(0, 0, 0, .15)',
  },
  watermarkContent: ['BREEZE', 'VUE3'],
  defaultLanguage: LANGUAGE.ZH_CN,
  size: 'small',
}
