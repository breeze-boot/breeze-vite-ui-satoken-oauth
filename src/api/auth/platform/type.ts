/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 平台列表实体类型
 */
export interface PlatformRecord {
  id?: number
  platformName?: string
  platformCode?: string
  description?: string
}

/**
 * 平台列表数组类型
 */
export type PlatformRecords = PlatformRecord[]

/**
 * 平台响应返回类型
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
 * 平台列表查询类型
 */
export interface PlatformQuery extends PageQuery {
  platformCode: string
  platformName: string
}
