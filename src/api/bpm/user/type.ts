/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 用户列表类型声明
 */
export interface UserRecord {
  id?: number
}

/**
 * 用户列表数组类型声明
 */
export type UserRecords = UserRecord[]

/**
 * 用户列表接口响应类型声明
 */
export interface UserResponseData extends ResponseData {
  data: {
    records: UserRecords | UserRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 用户列表查询类型声明
 */
export interface UserQuery extends PageQuery {
  taskName: string
  taskTitle: string
}
