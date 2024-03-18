import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'
import pinia from '@/store'
import { ElMessage } from 'element-plus'
import JSONBigInt from 'json-bigint'
import { StorageName } from '@/types/types'
import router from '@/router'
import useUserStore from '@/store/modules/user'
import { LoginResponseData } from '@/api/login/type.ts'
import { convertBigNumberToString } from '@/utils/common.ts'

let isRefreshing: boolean = false // 标记是否正在刷新token
let requests: any[] = [] // 存储待重发的请求
let userStore: any = undefined

/**
 * 创建axios实例
 */
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
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
    config.headers[StorageName.Authorization] = `Bearer ${accessToken}`
  }
  config.headers[StorageName.XTenantId] = userStore.userInfo.tenantId || '1'
  return config
})

const handleNetworkError = (error: any): void => {
  let message = '网络错误'
  if (error.response) {
    switch (error.response.status) {
      case 404:
        message = '网络请求不存在'
        break
      case 503:
        message = '服务不可用'
        break
      case 400:
        message = '请求参数错误'
        break
      case 403:
        message = '权限不足，请重新登录'
        break
      case 500:
        message = '服务器内部错误'
        break
      default:
        message = '未知错误'
    }
  }
  ElMessage.error(message)
}

/**
 * 重定向到登录页
 */
const redirectToLogin = async (): Promise<void> => {
  await userStore.logout()
  await router.push({ path: '/login' }).then((): void => {})
}

/**
 * 重定向到登录页
 *
 * @param error
 */
const handleRefreshToken = async (error: any) => {
  if (!error.config._retry && !isRefreshing) {
    error.config._retry = true
    isRefreshing = true

    try {
      const response: LoginResponseData = await userStore.toRefreshToken()
      const token: string = response.access_token
      error.config.headers['Authorization'] = `Bearer ${token}`
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
        error.config.headers['Authorization'] = `Bearer ${token}`
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
  if (isRefreshing && error.response.data.code === 'A103') {
    await redirectToLogin()
    ElMessage.error('刷新失败，请重新登录')
    return Promise.reject(error.response.data)
  }
  return await handleRefreshToken(error)
}

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message, access_token } = response.data
    switch (code) {
      case '0000':
        return response.data
      case '0001':
        ElMessage.warning(message || '警告')
        break
      case '0002':
        ElMessage.error('系统异常')
        break
      case undefined:
        // 没有code时正常返回数据
        return access_token ? response.data : response
      default:
        ElMessage.error('服务异常')
    }
  },
  async (error: any) => {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        switch (error.code) {
          case 'ECONNABORTED':
            ElMessage.error(`连接超时 ${error.message}`)
            return Promise.reject(error)
          default:
            ElMessage.error(`连接异常`)
            console.error(`${error.message}`)
            return Promise.reject(error)
        }
      }
      switch (error.response.status) {
        case 401:
          return handle401Error(error)
        default:
          handleNetworkError(error)
      }
      return Promise.reject(error)
    }
    if (error.name.concat('SyntaxError')) {
      ElMessage.error(`连接异常 ${error.message}`)
      return Promise.reject(error)
    }
  },
)

export default request
