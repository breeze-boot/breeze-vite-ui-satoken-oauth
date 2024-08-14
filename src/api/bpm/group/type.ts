/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 用户组列表类型声明
 */
export interface GroupRecord {
  id?: number
}

/**
 * 用户组列表数组类型声明
 */
export type GroupRecords = GroupRecord[]

/**
 * 用户组列表接口响应类型声明
 */
export interface GroupResponseData extends ResponseData {
  data: {
    records: GroupRecords | GroupRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 用户组列表查询类型声明
 */
export interface GroupQuery extends PageQuery {}
