/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 字典列表实体类型
 */
export interface Dict {
  id?: number
  label: string
  value: string
}

/**
 * 字典列表数组类型
 */
export type DictRecords = Dict[]

/**
 * 字典响应返回类型
 */
export interface DictResponseData extends ResponseData {
  data: {
    records: DictRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 字典列表查询类型
 */
export interface DictQuery extends PageQuery {
  keywords?: string
  status?: number
  startTime?: string
  endTime?: string
}
