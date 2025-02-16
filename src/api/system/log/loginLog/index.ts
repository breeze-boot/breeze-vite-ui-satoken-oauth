/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { LoginLogResponseData, LoginLogQuery } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  LOGIN_LOG_RESTFUL_URL = '/sys/v1/loginLog',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: LoginLogQuery): AxiosPromise<LoginLogResponseData> {
  return request({
    url: `${API.LOGIN_LOG_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteLog(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.LOGIN_LOG_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}
