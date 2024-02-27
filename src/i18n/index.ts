import { createI18n } from 'vue-i18n'
import zhCn from './lang/zh-cn'
import en from './lang/en'
import useSettingStore from '@/store/modules/setting.ts'

const settings = useSettingStore().settings
const pages: Record<string, any> = import.meta.glob('./../../**/**/**/i18n/*.ts', { eager: true })

/**
 * 获取子目录下的国际化配置
 *
 * @param pages
 */
const getImports = (pages: Record<string, any>): any => {
  const importsZh: Record<string, any> = {}
  const importsEn: Record<string, any> = {}

  for (const key in pages) {
    if (key.indexOf('en.ts') > 0) {
      const module = pages[key]
      const moduleContent = module.default || module
      Object.assign(importsEn, moduleContent)
    }
    if (key.indexOf('zh-cn.ts') > 0) {
      const module = pages[key]
      const moduleContent = module.default || module
      Object.assign(importsZh, moduleContent)
    }
  }
  const imports: Record<string, any> = {}
  Object.assign(importsZh, zhCn)
  Object.assign(importsEn, en)

  Object.assign(imports, {
    en: importsEn,
  })
  Object.assign(imports, {
    zhCn: importsZh,
  })
  return imports
}

const modules = getImports(pages)

const i18n = createI18n({
  locale: settings.language,
  fallbackLocale: 'zhCn', // 设置备用语言
  messages: {
    zhCn: modules['zhCn'],
    en: modules['en'],
  },
  legacy: false,
  globalInjection: true,
})

export default i18n
