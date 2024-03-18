/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 用户消息列表类型声明
 */
export interface MsgUserRecord {
  id?: number
  title?: string
  code?: string
  type?: string
  level?: string
  username?: string
  isRead?: string
  isClose?: string
  createTime?: string
}

/**
 * 用户消息列表数组类型声明
 */
export type MsgUserRecords = MsgUserRecord[]

/**
 * 用户消息响应返回类型声明
 */
export interface MsgUserResponseData extends ResponseData {
  data: {
    records: MsgUserRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 用户消息列表查询类型声明
 */
export interface MsgUserQuery extends PageQuery {
  title?: string
  code?: string
  type?: string
  level?: string
  username?: string
  createTime?: string
  isRead?: string
  isClose?: string
}
