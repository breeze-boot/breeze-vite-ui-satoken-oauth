/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { InstanceResponseData, InstanceQuery, InstanceRecord } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  CATEGORY_RESTFUL_URL = '/flow/v1/instance',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: InstanceQuery): AxiosPromise<InstanceResponseData> {
  return request({
    url: API.CATEGORY_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getInstance(id: number): AxiosPromise<InstanceResponseData> {
  return request({
    url: `${API.CATEGORY_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteInstance(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.CATEGORY_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: InstanceRecord): AxiosPromise<any> {
  return request({
    url: API.CATEGORY_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}
