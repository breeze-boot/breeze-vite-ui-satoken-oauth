import logoUrl from '@/assets/vue.svg'
import { reactive } from 'vue'
import { DEVICE } from '@/utils/common.ts'

/**
 * 用于项目logo | 标题配置
 */
export default {
  title: 'Breeze-Vite-UI',
  defaultIsCollapse: false,
  defaultDevice: DEVICE.PC,
  defaultShowAvatar: false,
  defaultLogoUrl: logoUrl,
  defaultEnableWatermark: true,
  defaultLogoHidden: true,
  defaultMenuLayout: 'left',
  defaultThemeColor: 'rgb(64, 158, 255)',
  defaultEnableDark: 'light',
  lightFont: reactive({
    color: 'rgba(255, 255, 255, .15)',
  }),
  darkFont: reactive({
    color: 'rgba(0, 0, 0, .15)',
  }),
  watermarkContent: ['BREEZE', 'VUE3'],
  defaultLanguage: 'zhCn',
  size: 'small',
  printClientUrl: 'http://127.0.0.1:17521',
}
