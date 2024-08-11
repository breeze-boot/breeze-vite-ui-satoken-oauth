/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 流程分类列表类型声明
 */
export interface CategoryRecord {
  id?: number
  categoryName: string
  categoryCode: string
  tenantId: string
}

/**
 * 流程分类列表数组类型声明
 */
export type CategoryRecords = CategoryRecord[]

/**
 * 流程分类列表接口响应类型声明
 */
export interface CategoryResponseData extends ResponseData {
  data: {
    records: CategoryRecords | CategoryRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 流程分类列表查询类型声明
 */
export interface CategoryQuery extends PageQuery {
  categoryName: string
  categoryCode: string
}

/**
 * 流程分类表单类型声明
 */
export interface CategoryForm {
  id?: number
  categoryName: string
  categoryCode: string
  tenantId: string
}
