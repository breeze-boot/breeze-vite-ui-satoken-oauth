/**
 * @author: gaoweixuan
 * @since: 2025-04-22
 */
import request from '@/utils/request'
import { AiModelResponseData, AiModelQuery, AiModelRecord, AiModelForm } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  AI_MODEL_RESTFUL_URL = '/ai/v1/aiModel',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: AiModelQuery): Promise<AiModelResponseData> {
  return request<any, AiModelResponseData>({
    url: `${API.AI_MODEL_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getAiModel(id: number): Promise<AiModelResponseData> {
  return request<any, AiModelResponseData>({
    url: `${API.AI_MODEL_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addAiModel(data: AiModelForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.AI_MODEL_RESTFUL_URL,
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
export function editAiModel(id: number, data: AiModelForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: `${API.AI_MODEL_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteAiModel(ids: number[]): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.AI_MODEL_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param data
 */
export function exportExcel(data: AiModelRecord): Promise<any> {
  return request<any, any>({
    url: API.AI_MODEL_RESTFUL_URL,
    method: 'post',
    data,
    // 指定响应类型为二进制流
    responseType: 'blob',
  })
}
