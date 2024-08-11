/**
 * @author: gaoweixuan
 * @since: 2024-08-11
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 已办任务列表类型声明
 */
export interface ApplyRecord {
  id?: number
  taskName?: string
  owner?: string
  definitionKey?: string
  procInstId?: string
  taskId?: string
  procDefId?: string
  procDefKey?: string
  businessKey?: string
  applyUser?: string
  applyUserName?: string
  userList?: string[]
  status?: string
  comment?: string
  assignee?: string
  assigneeName?: string
  variable?: string
  tenantId?: string
  taskDefKey?: string
  formKey?: string
  creatTime?: string
}

/**
 * 已办任务列表数组类型声明
 */
export type ApplyRecords = ApplyRecord[]

/**
 * 已办任务列表接口响应类型声明
 */
export interface ApplyResponseData extends ResponseData {
  data: {
    records: ApplyRecords | ApplyRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 已办任务列表查询类型声明
 */
export interface ApplyQuery extends PageQuery {
  taskName: string
  taskTitle: string
}
