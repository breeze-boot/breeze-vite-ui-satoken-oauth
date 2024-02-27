/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { ResponseData, SelectResponseData } from '@/types/types.ts'

/**
 * 菜单列表实体类型
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
 * 菜单列表数组类型
 */
export type MenuRecords = MenuRecord[]

/**
 * 菜单响应返回类型
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
 * 平台响应返回类型
 */
export interface PlatformSelectData extends ResponseData {
  data: {
    value: number
    label: string
  }
}

/**
 * 菜单下拉框响应返回类型
 */
export interface MenuSelectData extends ResponseData {
  data: {
    value: number
    label: string
    children?: SelectResponseData
  }
}

/**
 * 菜单列表查询类型
 */
export interface MenuQuery {
  name?: string
  title?: string
}
