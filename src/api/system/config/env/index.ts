/**
 * @author: gaoweixuan
 * @since: 2025-07-20
 */
import request from '@/utils/request'
import { ConfigEnvResponseData, ConfigEnvQuery, ConfigEnvRecord, ConfigEnvForm } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  SYS_CONFIG_ENV_RESTFUL_URL = '/sys/v1/configEnv',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: ConfigEnvQuery): Promise<ConfigEnvResponseData> {
  return request<any, ConfigEnvResponseData>({
    url: `${API.SYS_CONFIG_ENV_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getSysConfigEnv(id: number): Promise<ConfigEnvResponseData> {
  return request<any, ConfigEnvResponseData>({
    url: `${API.SYS_CONFIG_ENV_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addSysConfigEnv(data: ConfigEnvForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.SYS_CONFIG_ENV_RESTFUL_URL,
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
export function editSysConfigEnv(id: number, data: ConfigEnvForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: `${API.SYS_CONFIG_ENV_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteSysConfigEnv(ids: number[]): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.SYS_CONFIG_ENV_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param data
 */
export function exportExcel(data: ConfigEnvRecord): Promise<any> {
  return request<any, any>({
    url: API.SYS_CONFIG_ENV_RESTFUL_URL,
    method: 'post',
    data,
    // 指定响应类型为二进制流
    responseType: 'blob',
  })
}
