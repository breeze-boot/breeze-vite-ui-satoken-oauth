/**
 * @author: gaoweixuan
 * @since: 2025-04-19
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * AiPlatform列表类型声明
 */
export interface AiPlatformRecord {
  id: number
  platformCode: string
  platformName: string
  description: string
}

/**
 * AiPlatform列表数组类型声明
 */
export type AiPlatformRecords = AiPlatformRecord[]

/**
 * AiPlatform列表接口响应类型声明
 */
export interface AiPlatformResponseData extends ResponseData {
  data: {
    records: AiPlatformRecords | AiPlatformRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * AiPlatform列表查询类型声明
 */
export interface AiPlatformQuery extends PageQuery {
  platformName: string
  platformCode: string
}

/**
 * AiPlatform表单类型声明
 */
export interface AiPlatformForm {
  id?: number
  platformCode: string
  platformName: string
  description: string
}
