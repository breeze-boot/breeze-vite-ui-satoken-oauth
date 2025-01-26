/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 角色列表类型声明
 */
export interface RoleRecord {
  id?: number
  roleName?: string
  roleCode?: string
  rowPermissionType?: string
  rowPermissionName?: string
  rowPermissionIds?: number[]
}

/**
 * 角色列表数组类型声明
 */
export type RoleRecords = RoleRecord[]

/**
 * 角色列表接口响应类型声明
 */
export interface RoleResponseData extends ResponseData {
  data: {
    records: RoleRecords | RoleRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 角色列表查询类型声明
 */
export interface RoleQuery extends PageQuery {
  userId?: number
  roleCode: string
  roleName: string
}

/**
 * 角色表单类型声明
 */
export interface RoleForm {
  id?: number
  roleName?: string
  roleCode?: string
  rowPermissionType?: string
  rowPermissionIds?: number[]
}

/**
 * 添加权限修改参数类型
 */
export interface ModifyPermissionForm {
  roleId: number
  permissionIds: number[]
  menuIds?: number[] // 菜单权限IDs
  columnIds?: number[] // 列权限IDs
}
