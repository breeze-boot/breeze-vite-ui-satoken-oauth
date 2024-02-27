/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { LogResponseData, LogQuery } from './type'

enum API {
  LOG_RESTFUL_URL = '/log',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: LogQuery): AxiosPromise<LogResponseData> {
  return request({
    url: API.LOG_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getLog(id: number): AxiosPromise<LogResponseData> {
  return request({
    url: `${API.LOG_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteLog(ids: number[]): AxiosPromise<LogResponseData> {
  return request({
    url: API.LOG_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}
