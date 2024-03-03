/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 平台列表类型声明
 */
export interface PlatformRecord {
  id?: number
  platformName?: string
  platformCode?: string
  description?: string
}

/**
 * 平台列表数组类型声明
 */
export type PlatformRecords = PlatformRecord[]

/**
 * 平台列表接口响应类型声明
 */
export interface PlatformResponseData extends ResponseData {
  data: {
    records: PlatformRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 平台列表查询类型声明
 */
export interface PlatformQuery extends PageQuery {
  platformCode: string
  platformName: string
}
