/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'

enum API {
  LOGIN_USER_PIE_URL = '/sys/v1/sysLog/home/statisticLoginUserPie',
}

/**
 * 统计登录用户饼图
 */
export function statisticLoginUserPie(): AxiosPromise<any> {
  return request({
    url: API.LOGIN_USER_PIE_URL,
    method: 'get',
  })
}
