/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 菜单列表实体类型
 */
export interface Menu {
  id: number
  createTime: string
  updateTime: string
}

/**
 * 菜单列表数组类型
 */
export type MenuRecords = Menu[]

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
 * 菜单列表查询类型
 */
export interface MenuQuery extends PageQuery {
  keywords?: string
  status?: number
  startTime?: string
  endTime?: string
}
