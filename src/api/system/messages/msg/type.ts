/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 消息列表类型声明
 */
export interface MsgRecord {
  id?: number
  title?: string
  code?: string
  type?: string
  level?: string
  content?: string
}

/**
 * 消息列表数组类型声明
 */
export type MsgRecords = MsgRecord[]

/**
 * 消息响应返回类型声明
 */
export interface MsgResponseData extends ResponseData {
  data: {
    records: MsgRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 消息列表查询类型声明
 */
export interface MsgQuery extends PageQuery {
  title?: string
  code?: string
  type?: string
  level?: string
  username?: string
  createTime?: string
  isRead?: string
  isClose?: string
}
