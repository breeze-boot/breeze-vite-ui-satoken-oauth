/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request.ts'
import { AxiosPromise } from 'axios'
import { LogResponseData, LogQuery } from './type.ts'
import { ResponseData } from '@/types/types.ts'

enum API {
  SYS_LOG_RESTFUL_URL = '/sys/v1/sysLog',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: LogQuery): AxiosPromise<LogResponseData> {
  return request({
    url: API.SYS_LOG_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteLog(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.SYS_LOG_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}
