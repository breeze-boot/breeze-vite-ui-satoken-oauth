/**
 * @author: gaoweixuan
 * @since: 2024-02-28
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { JLogResponseData, JLogQuery, JLogRecord } from './type'

enum API {
  J_LOG_RESTFUL_URL = '/jLog',
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
 * 获取详情
 *
 * @param id
 */
export function getJLog(id: number): AxiosPromise<JLogResponseData> {
  return request({
    url: `${API.J_LOG_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addJLog(data: JLogRecord): AxiosPromise<JLogResponseData> {
  return request({
    url: API.J_LOG_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param data
 */
export function editJLog(data: JLogRecord): AxiosPromise<JLogResponseData> {
  return request({
    url: API.J_LOG_RESTFUL_URL,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteJLog(ids: number[]): AxiosPromise<JLogResponseData> {
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
export function exportExcel(params: JLogQuery): AxiosPromise<JLogResponseData> {
  return request({
    url: API.J_LOG_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}
