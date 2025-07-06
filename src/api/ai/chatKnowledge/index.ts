/**
 * @author: gaoweixuan
 * @since: 2025-04-22
 */
import request from '@/utils/request'
import { AiChatKnowledgeResponseData, AiChatKnowledgeQuery, AiChatKnowledgeRecord } from './type'
import { ResponseData } from '@/types/types.ts'
import { AxiosPromise } from 'axios'
import { FileUploadResponseData } from '@/api/system/file/type.ts'

enum API {
  AI_CHAT_DOC_RESTFUL_URL = '/ai/v1/aiChatKnowledge',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: AiChatKnowledgeQuery): Promise<AiChatKnowledgeResponseData> {
  return request<any, AiChatKnowledgeResponseData>({
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
export function getAiChatKnowledge(id: number): Promise<AiChatKnowledgeResponseData> {
  return request<any, AiChatKnowledgeResponseData>({
    url: `${API.AI_CHAT_DOC_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 上传文件
 *
 * @param file
 */
export function addAiChatKnowledge(file: File): AxiosPromise<FileUploadResponseData> {
  const formData: FormData = new FormData()
  formData.append('files', file)

  return request({
    url: `/ai/v1/importDoc`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
/**
 * 删除
 *
 * @param ids
 */
export function deleteAiChatKnowledge(ids: number[]): Promise<ResponseData> {
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
export function exportExcel(data: AiChatKnowledgeRecord): Promise<any> {
  return request<any, any>({
    url: API.AI_CHAT_DOC_RESTFUL_URL,
    method: 'post',
    data,
    // 指定响应类型为二进制流
    responseType: 'blob',
  })
}
