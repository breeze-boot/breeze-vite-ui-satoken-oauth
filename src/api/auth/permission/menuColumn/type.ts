/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { ColumnCacheData, PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 菜单列列表类型声明
 */
export interface MenuColumnRecord {
  id: number
  menu?: string
  column?: string
}

/**
 * 菜单列列表数组类型声明
 */
export type MenuColumnRecords = MenuColumnRecord[]

/**
 * 菜单列列表接口响应类型声明
 */
export interface MenuColumnResponseData extends ResponseData {
  data: {
    records: MenuColumnRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 菜单列列表查询类型声明
 */
export interface MenuColumnQuery extends PageQuery {
  menu: string
  column: string
}

/**
 * 角色的菜单列响应类型声明
 */
export interface RolesColumnCacheResponseData extends ResponseData {
  data: ColumnCacheData[]
}
