/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { ResponseData } from '@/types/types.ts'

/**
 * 部门列表类型声明
 */
export interface DeptRecord {
  id?: number
  parentId?: number | string
  deptCode?: string
  deptName?: string
}

/**
 * 部门列表数组类型声明
 */
export type DeptRecords = DeptRecord[]

/**
 * 部门列表接口响应类型声明
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
 * 部门列表查询类型声明
 */
export interface DeptQuery {
  deptName?: string
  deptCode?: string
}

/**
 * 部门表单类型声明
 */
export interface DeptForm {
  id?: number
  parentId?: number | string
  deptCode?: string
  deptName?: string
}
