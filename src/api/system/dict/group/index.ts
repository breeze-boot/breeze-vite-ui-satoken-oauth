/**
 * @author: gaoweixuan
 * @since: 2025-07-20
 */
import request from '@/utils/request'
import { DictGroupResponseData, DictGroupQuery, DictGroupRecord, DictGroupForm } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  SYS_DICT_GROUP_RESTFUL_URL = '/sys/v1/dictGroup',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data?: DictGroupQuery): Promise<DictGroupResponseData> {
  return request<any, DictGroupResponseData>({
    url: `${API.SYS_DICT_GROUP_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 列表
 */
export function list(): Promise<ResponseData> {
  return request<any, DictGroupResponseData>({
    url: `${API.SYS_DICT_GROUP_RESTFUL_URL}/list`,
    method: 'post',
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getSysDictGroup(id: number): Promise<DictGroupResponseData> {
  return request<any, DictGroupResponseData>({
    url: `${API.SYS_DICT_GROUP_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addSysDictGroup(data: DictGroupForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.SYS_DICT_GROUP_RESTFUL_URL,
    method: 'post',
    data,
  })
}

/**
 * 编辑
 *
 * @param id
 * @param data
 */
export function editSysDictGroup(id: number, data: DictGroupForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: `${API.SYS_DICT_GROUP_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteSysDictGroup(ids: number[]): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.SYS_DICT_GROUP_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param data
 */
export function exportExcel(data: DictGroupRecord): Promise<any> {
  return request<any, any>({
    url: API.SYS_DICT_GROUP_RESTFUL_URL,
    method: 'post',
    data,
    // 指定响应类型为二进制流
    responseType: 'blob',
  })
}
