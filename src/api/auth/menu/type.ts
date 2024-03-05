/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { ResponseData } from '@/types/types.ts'

/**
 * 菜单列表类型声明
 */
export interface MenuRecord {
  id?: number | string
  platformId?: number
  platformName?: string
  name?: string
  title?: string
  icon?: string
  sort: number
  parentId?: number | string
  permission?: string
  component?: string
  href: number
  keepAlive: number
  hidden: number
  type: number
  path?: string
}

/**
 * 菜单列表数组类型声明
 */
export type MenuRecords = MenuRecord[]

/**
 * 菜单列表接口响应类型声明
 */
export interface MenuResponseData extends ResponseData {
  data: {
    records: MenuRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 菜单列表查询类型声明
 */
export interface MenuQuery {
  name?: string
  title?: string
}

/**
 * 菜单树形列表类型声明
 */
export interface MenuTreeRecord {
  id: number | string
  title: string
  children?: MenuTreeRecord[]
}

/**
 * 菜单树形列表响应类型声明
 */
export interface MenuTreeResponseData extends ResponseData {
  data: {
    records: MenuTreeRecord
    total: number
    size: number
    current: number
    pages: number
  }
}
