/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 角色列表实体类型
 */
export interface RoleRecord {
  id?: number
  roleName?: string
  roleCode?: string
}

/**
 * 角色列表数组类型
 */
export type RoleRecords = RoleRecord[]

/**
 * 角色响应返回类型
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
 * 角色列表查询类型
 */
export interface RoleQuery extends PageQuery {
  id?: number
  roleCode: string
  roleName: string
}
