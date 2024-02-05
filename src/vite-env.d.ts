/// <reference types="vite/client" />
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}

interface ImportMetaEnv {
  VITE_APP_TITLE: string
  VITE_APP_BASE_SERVER: string
  VITE_APP_BASE_PORT: string
  /** API 基础路径 */
  VITE_APP_BASE_API: string
  VITE_APP_WS_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'element-plus'
declare module 'element-plus/dist/locale/zh-cn.mjs'
declare module 'element-plus/dist/locale/en.mjs'
declare module 'vue-i18n'
declare module 'lodash-es'
declare module 'crypto-js'
declare module 'nprogress'
declare module 'json-bigint'
