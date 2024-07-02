/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 待办任务列表类型声明
 */
export interface TodoRecord {
  id?: number
  todoName?: string
  todoCode?: string
  description?: string
}

/**
 * 待办任务列表数组类型声明
 */
export type TodoRecords = TodoRecord[]

/**
 * 待办任务列表接口响应类型声明
 */
export interface TodoResponseData extends ResponseData {
  data: {
    records: TodoRecords | TodoRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 待办任务列表查询类型声明
 */
export interface TodoQuery extends PageQuery {
  title: string
  name: string
}
