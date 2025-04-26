/// <reference types="vite/client" />
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_SERVER: string
  readonly VITE_APP_BASE_PORT: string
  /** API 基础路径 */
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_WS_API: string
  readonly VITE_APP_MINIO_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
