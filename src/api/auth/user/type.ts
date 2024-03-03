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
  avatar?: string
  avatarName?: string
  username?: string
  userCode?: string
  email?: string
  amountName?: string
  deptId?: number[]
  postId?: number[]
  idCard?: string
  roleIds?: number[]
  confirmPassword?: string
  sex?: number
  isLock?: number
  password?: string
  phone?: string
  roleName?: string
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
    records: UserRecords
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
  userCode: string
  username: string
  isLock: string
  status?: number
  startTime?: string
  endTime?: string
}

/**
 * 用户角色列表查询类型声明
 */
export interface UserRoleQuery extends PageQuery {
  userId: number
  roleCode: string
  roleName: string
}

/**
 * 用户switch锁定开启参数类型声明
 */
export interface UserSwitchParam {
  username?: string
  isLock?: number
}

/**
 * 用户密码重置表单类型声明
 */
export interface UserResetPasswordParam {
  id?: number
  password?: string
  confirmPassword?: string
}

/**
 *用户角色设置表单类型声明
 */
export interface UserSetRoleParam {
  userId: number
  roleIds: number[]
}
