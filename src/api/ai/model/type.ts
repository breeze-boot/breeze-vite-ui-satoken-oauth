/**
 * @author: gaoweixuan
 * @since: 2025-04-22
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * AI模型列表类型声明
 */
export interface AiModelRecord {
  id: number
  modelName: string
  platformCode: string
  description: string
}

/**
 * AI模型列表数组类型声明
 */
export type AiModelRecords = AiModelRecord[]

/**
 * AI模型列表接口响应类型声明
 */
export interface AiModelResponseData extends ResponseData {
  data: {
    records: AiModelRecords | AiModelRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * AI模型列表查询类型声明
 */
export interface AiModelQuery extends PageQuery {
  id: number
  modelName: string
  platformCode: string
  description: string
}

/**
 * AI模型表单类型声明
 */
export interface AiModelForm {
  id?: number
  modelName: string
  platformCode: string
  description: string
}
