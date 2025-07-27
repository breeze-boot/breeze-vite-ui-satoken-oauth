/**
 * @author: gaoweixuan
 * @since: 2024-03-01
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 字典列表类型声明
 */
export interface DictRecord {
  id?: number
  dictName: string
  dictCode: string
  status: number
}

/**
 * 字典列表数组类型声明
 */
export type DictRecords = DictRecord[]

/**
 * 字典列表接口响应类型声明
 */
export interface DictResponseData extends ResponseData {
  data: {
    records: DictRecords | DictRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 字典列表查询类型声明
 */
export interface DictQuery extends PageQuery {
  dictCode: string
  dictName: string
  groupId?: number
}

/**
 * 字典switch锁定开启参数类型声明
 */
export interface DictSwitchForm {
  id?: number
  status?: number
}

/**
 * 字典表单类型声明
 */
export interface DictForm {
  id?: number
  groupId: number
  dictName: string
  dictCode: string
  status: number
}
