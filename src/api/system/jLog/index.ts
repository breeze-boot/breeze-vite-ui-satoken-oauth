/**
 * @author: gaoweixuan
 * @since: 2024-02-28
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { JLogResponseData, JLogQuery } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  J_LOG_RESTFUL_URL = '/sys/v1/jLog',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: JLogQuery): AxiosPromise<JLogResponseData> {
  return request({
    url: API.J_LOG_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteJLog(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.J_LOG_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: JLogQuery): AxiosPromise<any> {
  return request({
    url: API.J_LOG_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}
