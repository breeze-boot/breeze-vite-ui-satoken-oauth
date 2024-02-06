import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { GET_STRING_STORAGE } from './storage'
import JSONBig from 'json-bigint'
import { StorageName } from '@/types/types'
import { useRouter } from 'vue-router'
import pinia from '@/store'
import useUserStore from '@/store/modules/user'
import { LoginResponseData } from '@/api/login/type.ts'

const $router = useRouter()
const userStore = useUserStore(pinia)

let isRefreshing = false // 标记是否正在刷新token
let requests: any[] = [] // 存储待重发的请求

/**
 * 创建axios实例
 */
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

/**
 * 转换bigNumber
 */
request.defaults.transformResponse = [
  (data: any) => {
    // 此处是使用json-bigint进行json格式化
    return JSONBig.parse(data)
  },
]

/**
 * 请求拦截器
 */
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = GET_STRING_STORAGE(StorageName.AccessToken)
  /**
   * 如果存在token，请求携带token
   */
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = 'Bearer ' + accessToken
  }
  config.headers.tenantId = GET_STRING_STORAGE(StorageName.XTenantId) || '1'
  return config
})

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.code === '0001' && response.data.message) {
      // 业务逻辑验证警告
      ElMessage({
        type: 'warning',
        message: response.data.message,
      })
      return Promise.reject(response)
    } else if (response.data.code === '0002' && response.data.message) {
      // 业务错误失败
      ElMessage({
        type: 'error',
        message: '系统异常',
      })
      return Promise.reject(response)
    } else if (response.data.code === '0000' || response.data.access_token) {
      return response.data
    } else {
      // 系统错误
      ElMessage({
        type: 'error',
        message: '服务异常',
      })
      return Promise.reject(response)
    }
  },
  (error: any) => {
    // 无感刷新
    if (error.response.status === 401 && !error.config._retry && !isRefreshing) {
      isRefreshing = true
      error.config._retry = true
      return userStore
        .toRefreshToken()
        .then((response: LoginResponseData) => {
          const token: string = response.access_token
          error.config.headers['Authorization'] = 'Bearer ' + token
          // 重新发起被挂起的请求
          requests.forEach((cb) => cb(token))
          requests = [] // 重置数组
          return request(error.config)
        })
        .catch((e) => {
          // 处理Token刷新失败的情况，例如跳转到登录页
          $router.push({ path: '/login', query: {} }).then((r) => console.debug(r))
          ElMessage({
            type: 'error',
            message: '刷新失败',
          })
          console.error(`refresh_token error ${e}`)
        })
        .finally(() => {
          isRefreshing = false
        })
    } else {
      // 返回未执行resolve的promise
      return new Promise((resolve) => {
        // 将resolve放入队列，等待Token刷新后再执行
        requests.push((token: string) => {
          console.log(`发起请求：${error.config.url}`)
          error.config.headers['Authorization'] = 'Bearer ' + token
          resolve(request(error.config))
        })
      })
    }

    //处理网络错误
    let msg = ''
    if (error.message.includes('Unexpected')) {
      msg = '连接服务被拒绝'
    } else if (error.message.includes('timeout')) {
      msg = '请求超时'
    } else if (error.message.includes('Network Error')) {
      msg = '网络错误'
    } else {
      const status = error.response.status
      switch (status) {
        case 404:
          msg = '网络请求不存在'
          break
        case 503:
          msg = '服务不存在'
          break
        case 400:
          msg = '参数解析失败'
          break
        case 403:
          msg = '登录过期，请重新登录'
          break
        case 500:
          msg = '服务器出现问题'
          break
        default:
          msg = '无网络'
      }
    }
    ElMessage({
      type: 'error',
      message: msg,
    })
    return Promise.reject(error)
  },
)
export default request
