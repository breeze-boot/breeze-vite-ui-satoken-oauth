/**
 * @author: gaoweixuan
 * @since: 2025-07-20
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 字典分组列表类型声明
 */
export interface DictGroupRecord {
  id: number
  groupName: string
  groupCode: string
  status: number
}

/**
 * 字典分组列表数组类型声明
 */
export type DictGroupRecords = DictGroupRecord[]

/**
 * 字典分组列表接口响应类型声明
 */
export interface DictGroupResponseData extends ResponseData {
  data: {
    records: DictGroupRecords | DictGroupRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 字典分组列表查询类型声明
 */
export interface DictGroupQuery extends PageQuery {
  id: number
  groupName: string
  groupCode: string
  status: number
}

/**
 * 字典分组表单类型声明
 */
export interface DictGroupForm {
  id?: number
  groupName?: string
  groupCode?: string
  status: number
}
