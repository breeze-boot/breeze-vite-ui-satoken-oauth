/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { PlatformResponseData, PlatformQuery, PlatformRecord, PlatformForm } from './type'
import { ResponseData, SelectResponseData } from '@/types/types.ts'

enum API {
  PLATFORM_RESTFUL_URL = '/auth/v1/platform',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: PlatformQuery): Promise<PlatformResponseData> {
  return request<any, PlatformResponseData>({
    url: `${API.PLATFORM_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getPlatform(id: number): Promise<PlatformResponseData> {
  return request<any, PlatformResponseData>({
    url: `${API.PLATFORM_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addPlatform(data: PlatformForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.PLATFORM_RESTFUL_URL,
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
export function editPlatform(id: number, data: PlatformForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: `${API.PLATFORM_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deletePlatform(ids: number[]): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.PLATFORM_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: PlatformRecord): Promise<any> {
  return request<any, any>({
    url: API.PLATFORM_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 校验平台编码是否重复
 *
 *  @param platformCode
 *  @param platformId
 */
export function checkPlatformCode(platformCode: string, platformId?: number): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: `${API.PLATFORM_RESTFUL_URL}/checkPlatformCode`,
    method: 'get',
    params: {
      platformId: platformId,
      platformCode: platformCode,
    },
  })
}

/**
 * 平台下拉框
 *
 */
export function selectPlatform(): Promise<SelectResponseData> {
  return request<any, SelectResponseData>({
    url: `${API.PLATFORM_RESTFUL_URL}/selectPlatform`,
    method: 'get',
  })
}
