/**
 * @author: gaoweixuan
 * @since: 2025-07-20
 */
import request from '@/utils/request'
import { ConfigResponseData, ConfigQuery, ConfigRecord, ConfigForm } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  SYS_CONFIG_RESTFUL_URL = '/sys/v1/config',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: ConfigQuery): Promise<ConfigResponseData> {
  return request<any, ConfigResponseData>({
    url: `${API.SYS_CONFIG_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getSysConfig(id: number): Promise<ConfigResponseData> {
  return request<any, ConfigResponseData>({
    url: `${API.SYS_CONFIG_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addSysConfig(data: ConfigForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.SYS_CONFIG_RESTFUL_URL,
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
export function editSysConfig(id: number, data: ConfigForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: `${API.SYS_CONFIG_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteSysConfig(ids: number[]): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.SYS_CONFIG_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param data
 */
export function exportExcel(data: ConfigRecord): Promise<any> {
  return request<any, any>({
    url: API.SYS_CONFIG_RESTFUL_URL,
    method: 'post',
    data,
    // 指定响应类型为二进制流
    responseType: 'blob',
  })
}
