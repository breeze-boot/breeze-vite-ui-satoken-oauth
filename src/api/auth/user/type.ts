/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 用户switch锁定开启参数类型
 */
export interface UserSwitchForm {
  username?: string
  isLock?: number
}

/**
 * 用户列表实体类型
 */
export interface User {
  id?: number | undefined
  createTime?: string
  updateTime?: string
  username?: string
  password?: string
  name?: string
  phone?: string
  roleName?: string
}

/**
 * 用户列表数组类型
 */
export type UserRecords = User[]

/**
 * 用户响应返回类型
 */
export interface UserResponseData extends ResponseData {
  data: {
    records: UserRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 用户列表查询类型
 */
export interface UserQuery extends PageQuery {
  keywords?: string
  status?: number
  startTime?: string
  endTime?: string
}
