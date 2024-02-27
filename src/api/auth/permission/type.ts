/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 权限列表实体类型
 */
export interface PermissionRecord {
  id?: number
  permissionName?: string
  permissionCode?: string
}

/**
 * 权限列表数组类型
 */
export type PermissionRecords = PermissionRecord[]

/**
 * 权限响应返回类型
 */
export interface PermissionResponseData extends ResponseData {
  data: {
    records: PermissionRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 权限列表查询类型
 */
export interface PermissionQuery extends PageQuery {
  permissionCode: string
  permissionName: string
  isLock: string
  status?: number
  startTime?: string
  endTime?: string
}
