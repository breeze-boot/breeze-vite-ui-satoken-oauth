/**
 * @author: gaoweixuan
 * @since: 2025-07-20
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 系统参数分类表列表类型声明
 */
export interface configCategRecord {
  id: any
  categCode: string
  categName: string
  description: string
}

/**
 * 系统参数分类表列表数组类型声明
 */
export type configCategRecords = configCategRecord[]

/**
 * 系统参数分类表列表接口响应类型声明
 */
export interface SysConfigCategResponseData extends ResponseData {
  data: {
    records: configCategRecords | configCategRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 系统参数分类表列表查询类型声明
 */
export interface configCategQuery extends PageQuery {
  id: any
  categCode: string
  categName: string
  description: string
}

/**
 * 系统参数分类表表单类型声明
 */
export interface SysConfigCategForm {
  id: any
  categCode?: string
  categName?: string
  description?: string
}
