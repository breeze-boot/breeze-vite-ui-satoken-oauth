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
  permissionCode?: string
  permissionIds?: number[]
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
    records: RoleRecords
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
 * 数据权限列类型声明
 */
export interface ColumnPermissionRecord {
  tableName?: string
  columnName?: string[]
  tableColumnName?: object
  roleId?: number
  menuId?: number | string
}
