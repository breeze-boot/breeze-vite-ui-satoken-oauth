/**
 * @author: gaoweixuan
 * @since: 2025-04-19
 */
import request from '@/utils/request.ts'
import { AiPlatformResponseData, AiPlatformQuery, AiPlatformRecord, AiPlatformForm } from './type.ts'
import { ResponseData } from '@/types/types.ts'

enum API {
  AI_PLATFORM_RESTFUL_URL = '/auth/v1/aiPlatform',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: AiPlatformQuery): Promise<AiPlatformResponseData> {
  return request<any, AiPlatformResponseData>({
    url: `${API.AI_PLATFORM_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getAiPlatform(id: number): Promise<AiPlatformResponseData> {
  return request<any, AiPlatformResponseData>({
    url: `${API.AI_PLATFORM_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addAiPlatform(data: AiPlatformForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.AI_PLATFORM_RESTFUL_URL,
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
export function editAiPlatform(id: number, data: AiPlatformForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: `${API.AI_PLATFORM_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteAiPlatform(ids: number[]): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.AI_PLATFORM_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param data
 */
export function exportExcel(data: AiPlatformRecord): Promise<any> {
  return request<any, any>({
    url: API.AI_PLATFORM_RESTFUL_URL,
    method: 'post',
    data,
    // 指定响应类型为二进制流
    responseType: 'blob',
  })
}
