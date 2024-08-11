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
  taskName: string
  taskTitle: string
}

/**
 * 审批记录类型声明
 */
export interface ApproveListRecord {
  startTime: string
  endTime: string
  taskName: string
  assignee: string
  assigneeName: string
  fullMessage: string
  procInstId: string
  taskId: string
  activityId: string
}

/**
 * 流程审批表单类型声明
 */
export interface FlowApprovalForm {
  taskId: string
  comment: string
  procInstId: string
  pass: boolean
  variables: any
}
