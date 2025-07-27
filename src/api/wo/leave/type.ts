/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 请假工单列表类型声明
 */
export interface LeaveRecord {
  id?: number
  title?: string
  code?: string
  startDate?: string
  endDate?: string
  reason?: string
}

/**
 * 请假工单列表数组类型声明
 */
export type LeaveRecords = LeaveRecord[]

/**
 * 请假工单列表接口响应类型声明
 */
export interface LeaveResponseData extends ResponseData {
  data: {
    records: LeaveRecords | LeaveRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 请假工单列表查询类型声明
 */
export interface LeaveQuery extends PageQuery {
  title: string
}

/**
 * 请假工单表单类型声明
 */
export interface LeaveForm {
  id?: number
  title: string
  code: string
  startDate: string
  endDate: string
  reason: string
}
