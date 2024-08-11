/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 流程实例列表类型声明
 */
export interface InstanceRecord {
  id?: number
  businessKey: string
  startUserName: string
  version: string
  key: string
  name: string
  startTime: string
  email: string
}

/**
 * 流程实例列表数组类型声明
 */
export type InstanceRecords = InstanceRecord[]

/**
 * 流程实例列表接口响应类型声明
 */
export interface InstanceResponseData extends ResponseData {
  data: {
    records: InstanceRecords | InstanceRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 流程实例列表查询类型声明
 */
export interface InstanceQuery extends PageQuery {
  businessKey: string
  procDefName: string
  startUserName: string
}
