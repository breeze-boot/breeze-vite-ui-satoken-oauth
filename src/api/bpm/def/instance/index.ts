/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { InstanceResponseData, InstanceQuery, InstanceRecord } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  INSTANCE_RESTFUL_URL = '/bpm/v1/instance',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: InstanceQuery): AxiosPromise<InstanceResponseData> {
  return request({
    url: API.INSTANCE_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteInstance(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.INSTANCE_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 作废
 *
 * @param procInstId
 */
export function voidInstance(procInstId: number): AxiosPromise<ResponseData> {
  return request({
    url: API.INSTANCE_RESTFUL_URL + `/voidProcess`,
    method: 'post',
    data: { procInstId },
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: InstanceRecord): AxiosPromise<any> {
  return request({
    url: API.INSTANCE_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * switch激活
 *
 * @param params
 */
export function suspendedInstance(params: any): AxiosPromise<ResponseData> {
  return request({
    url: API.INSTANCE_RESTFUL_URL + `/suspendedInstance`,
    method: 'put',
    params,
  })
}
