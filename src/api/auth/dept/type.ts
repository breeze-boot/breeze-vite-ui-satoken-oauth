/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { ResponseData, SelectResponseData } from '@/types/types.ts'

/**
 * 部门列表实体类型
 */
export interface DeptRecord {
  id?: number | string
  parentId?: number | string
  deptCode?: string
  deptName?: string
}

/**
 * 部门列表数组类型
 */
export type DeptRecords = DeptRecord[]

/**
 * 部门响应返回类型
 */
export interface DeptResponseData extends ResponseData {
  data: {
    records: DeptRecords
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
 * 部门列表查询类型
 */
export interface DeptQuery {
  deptName?: string
  deptCode?: string
}
