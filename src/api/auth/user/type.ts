/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData, SelectResponseData } from '@/types/types.ts'

/**
 * 用户switch锁定开启参数类型
 */
export interface UserSwitchForm {
  username?: string
  isLock?: number
}

/**
 * 用户密码重置表单类型
 */
export interface UserResetPasswordForm {
  id?: number
  password?: string
  confirmPassword?: string
}

/**
 *用户角色设置表单类型
 */
export interface UserSetRoleForm {
  id?: number
  roleIds?: number[]
}

/**
 * 用户列表实体类型
 */
export interface UserRecord {
  id?: number
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
 * 用户列表数组类型
 */
export type UserRecords = UserRecord[]

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
 * 部门响应返回类型
 */
export interface DeptSelectData extends ResponseData {
  data: {
    value: number
    label: string
    children?: SelectResponseData
  }
}

/**
 * 角色响应返回类型
 */
export interface RoleSelectData extends ResponseData {
  data: {
    value: number
    label: string
    children?: SelectResponseData
  }
}

/**
 * 职位响应返回类型
 */
export interface PostSelectData extends ResponseData {
  data: {
    value: number
    label: string
    children?: SelectResponseData
  }
}

/**
 * 用户列表查询类型
 */
export interface UserQuery extends PageQuery {
  userCode: string
  username: string
  isLock: string
  status?: number
  startTime?: string
  endTime?: string
}
