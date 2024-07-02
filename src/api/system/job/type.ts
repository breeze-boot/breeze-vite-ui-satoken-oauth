/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 任务列表类型声明
 */
export interface JobRecord {
  id?: number
  jobName?: string
  jobGroupName?: string
  cronExpression?: string
  clazzName?: string
  concurrent: number
  status: number
  misfirePolicy: number
}

/**
 * 任务列表数组类型声明
 */
export type JobRecords = JobRecord[]

/**
 * 任务列表接口响应类型声明
 */
export interface JobResponseData extends ResponseData {
  data: {
    records: JobRecords | JobRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 任务列表查询类型声明
 */
export interface JobQuery extends PageQuery {
  jobName?: string
  status?: number
}

/**
 * 任务switch锁定开启参数类型声明
 */
export interface JobSwitchParam {
  id?: number
  status?: number
}
