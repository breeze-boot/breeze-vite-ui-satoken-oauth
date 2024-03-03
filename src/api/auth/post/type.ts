/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 职位列表类型声明
 */
export interface PostRecord {
  id?: number
  postName?: string
  postCode?: string
}

/**
 * 职位列表数组类型声明
 */
export type PostRecords = PostRecord[]

/**
 * 职位列表接口响应类型声明
 */
export interface PostResponseData extends ResponseData {
  data: {
    records: PostRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 职位列表查询类型声明
 */
export interface PostQuery extends PageQuery {
  postCode: string
  postName: string
}
