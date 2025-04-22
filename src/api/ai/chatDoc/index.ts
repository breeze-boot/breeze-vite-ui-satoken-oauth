/**
 * @author: gaoweixuan
 * @since: 2025-04-22
 */
import request from '@/utils/request'
import { AiChatDocResponseData, AiChatDocQuery, AiChatDocRecord, AiChatDocForm } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  AI_CHAT_DOC_RESTFUL_URL = '/ai/v1/aiChatDoc',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: AiChatDocQuery): Promise<AiChatDocResponseData> {
  return request<any, AiChatDocResponseData>({
    url: `${API.AI_CHAT_DOC_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getAiChatDoc(id: number): Promise<AiChatDocResponseData> {
  return request<any, AiChatDocResponseData>({
    url: `${API.AI_CHAT_DOC_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addAiChatDoc(data: AiChatDocForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.AI_CHAT_DOC_RESTFUL_URL,
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
export function editAiChatDoc(id: number, data: AiChatDocForm): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: `${API.AI_CHAT_DOC_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteAiChatDoc(ids: number[]): Promise<ResponseData> {
  return request<any, ResponseData>({
    url: API.AI_CHAT_DOC_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param data
 */
export function exportExcel(data: AiChatDocRecord): Promise<any> {
  return request<any, any>({
    url: API.AI_CHAT_DOC_RESTFUL_URL,
    method: 'post',
    data,
    // 指定响应类型为二进制流
    responseType: 'blob',
  })
}
