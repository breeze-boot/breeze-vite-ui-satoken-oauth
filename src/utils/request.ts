import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import pinia from '@/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import JSONBigInt from 'json-bigint'
import { StorageName } from '@/types/types'
import router from '@/router'
import useUserStore from '@/store/modules/user'
import { LoginResponseData } from '@/api/login/type.ts'
import { convertBigNumberToString } from '@/utils/common.ts'
import i18n from '@/i18n/index'
import { CookiesKey } from '@/utils/cookies.ts'

let isRefreshing: boolean = false // 标记是否正在刷新token
let refreshTimes: number = 0
let requests: any[] = [] // 存储待重发的请求
let userStore: any = undefined

/**
 * 创建axios实例
 */
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  withCredentials: false, // 关闭 cookies 的发送和接收
})

/**
 * 转换bigNumber
 */
request.defaults.transformResponse = [
  (data: any) => {
    // 此处是使用json-bigint进行json格式化
    return convertBigNumberToString(JSONBigInt.parse(data))
  },
]

/**
 * 请求拦截器
 */
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.responseType === 'blob') {
    config.transformResponse = []
  }

  if (!userStore) {
    userStore = useUserStore(pinia)
  }
  // 如果存在token，请求携带token
  const accessToken: string = userStore.accessToken
  if (accessToken && !config.headers[StorageName.Authorization]) {
    config.headers[StorageName.Authorization] = `${accessToken}`
  }
  config.headers[CookiesKey.XTenantId] = userStore.tenantId
  config.headers[StorageName.AcceptLanguage] = i18n.global.locale.value
  return config
})

/**
 * 重定向到登录页
 */
const redirectToLogin = async (): Promise<void> => {
  ElMessageBox.confirm(i18n.global.t('common.sureToLogOutExitSystem'), i18n.global.t('common.tip'), {
    confirmButtonText: i18n.global.t('common.confirm'),
    cancelButtonText: i18n.global.t('common.cancel'),
    type: 'warning',
  }).then(async () => {
    await userStore.logout()
    await router.push({ path: '/login' }).then((): void => {})
  })
}

/**
 * 重定向到登录页
 *
 * @param error
 */
const handleRefreshToken = async (error: any) => {
  if (!isRefreshing) {
    refreshTimes++
    isRefreshing = true
    try {
      const response: LoginResponseData = await userStore.toRefreshToken()
      const token: string = response.access_token
      error.config.headers['Authorization'] = `${token}`
      requests.forEach((cb) => cb(token))
      requests = []
      return Promise.resolve(request(error.config))
    } catch (e) {
      await redirectToLogin()
      return Promise.reject(e)
    } finally {
      isRefreshing = false
    }
  } else {
    return new Promise((resolve): void => {
      requests.push((token: string): void => {
        error.config.headers['Authorization'] = `${token}`
        resolve(request(error.config))
      })
    })
  }
}

/**
 * 401处理逻辑
 *
 * @param error
 */
const handle401Error = async (error: any) => {
  if (refreshTimes == 1) {
    refreshTimes = 0
    ElMessage.error(i18n.global.t('axios.reLogin'))
    await redirectToLogin()
    throw new Error(i18n.global.t('axios.reLogin'))
  }
  return await handleRefreshToken(error)
}

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response
    return data
  },
  async (error: any) => {
    if (error.name === 'SyntaxError') {
      ElMessage.error(`${i18n.global.t('axios.connectionTimedOut')} ${error.message}`)
      return Promise.reject(error)
    }
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        switch (error.code) {
          case 'ECONNABORTED':
            ElMessage.error(`${i18n.global.t('axios.connectionTimedOut')} ${error.message}`)
            return Promise.reject(error)
          default:
            ElMessage.error(i18n.global.t('axios.systemAbnormality'))
            console.error(`${error.message}`)
            return Promise.reject(error)
        }
      }
      // 返回其他请求头
      const { data, status } = error.response
      let { message } = error.response.data
      switch (status) {
        case 401:
          return handle401Error(error)
        case 403:
          message = message || i18n.global.t('axios.insufficientPermissionsReLogin')
          break
        case 404:
          message = message || i18n.global.t('axios.networkRequestNotExist')
          break
        case 503:
          message = message || i18n.global.t('axios.serviceUnavailable')
          break
        case 400:
          message = message || i18n.global.t('axios.requestParameterError')
          break
        case 405:
          message = message || i18n.global.t('axios.preview')
          break
        case 500:
          message = message || i18n.global.t('axios.serverInternalError')
          break
        default:
          message = message || i18n.global.t('axios.unknownError')
          break
      }
      data.message = message
      return Promise.reject(data)
    }
  },
)

export default request
