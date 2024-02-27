/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 客户端列表实体类型
 */
export interface ClientRecord {
  id?: number
  clientName?: string
  clientCode?: string
}

/**
 * 客户端列表数组类型
 */
export type ClientRecords = ClientRecord[]

/**
 * 客户端响应返回类型
 */
export interface ClientResponseData extends ResponseData {
  data: {
    records: ClientRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 客户端列表查询类型
 */
export interface ClientQuery extends PageQuery {
  clientCode: string
  clientName: string
}
