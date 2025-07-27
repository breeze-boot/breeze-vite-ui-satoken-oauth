/**
 * @author: gaoweixuan
 * @since: 2025-07-20
 */
import request from '@/utils/request'
import { SysConfigCategResponseData, configCategQuery, configCategRecord, SysConfigCategForm } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  SYS_CONFIG_CATEG_RESTFUL_URL = '/sys/v1/configCateg',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: configCategQuery): Promise<SysConfigCategResponseData> {
  return request<any, SysConfigCategResponseData>({
    url: `${API.SYS_CONFIG_CATEG_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 列表
 */
export function list(): Promise<SysConfigCategResponseData> {
  return request<any, SysConfigCategResponseData>({
    url: `${API.SYS_CONFIG_CATEG_RESTFUL_URL}/list`,
    method: 'post',
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getSysConfigCateg(id: number): Promise<SysConfigCategResponseData> {
  return request<any, SysConfigCategResponseData>({
    url: `${API.SYS_CONFIG_CATEG_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addSysConfigCateg(data: SysConfigCategForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.SYS_CONFIG_CATEG_RESTFUL_URL,
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
export function editSysConfigCateg(id: number, data: SysConfigCategForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: `${API.SYS_CONFIG_CATEG_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteSysConfigCateg(ids: number[]): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.SYS_CONFIG_CATEG_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param data
 */
export function exportExcel(data: configCategRecord): Promise<any> {
  return request<any, any>({
    url: API.SYS_CONFIG_CATEG_RESTFUL_URL,
    method: 'post',
    data,
    // 指定响应类型为二进制流
    responseType: 'blob',
  })
}
