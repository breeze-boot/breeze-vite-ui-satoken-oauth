/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 权限列表类型声明
 */
export interface RowPermissionRecord {
  id?: number
  permissionName?: string
  permissionCode?: string
  customizesType?: string
  permissions?: number[]
}

/**
 * 权限列表数组类型声明
 */
export type RowPermissionRecords = RowPermissionRecord[]

/**
 * 权限列表接口响应类型声明
 */
export interface RowPermissionResponseData extends ResponseData {
  data: {
    records: RowPermissionRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 权限列表查询类型声明
 */
export interface RowPermissionQuery extends PageQuery {
  permissionCode: string
  permissionName: string
}

/**
 * 权限表单类型声明
 */
export interface RowPermissionForm {
  id?: number
  permissionName?: string
  permissionCode?: string
  customizesType?: string
  permissions: number[]
}
