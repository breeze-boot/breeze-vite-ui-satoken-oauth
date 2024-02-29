/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 任务switch锁定开启参数类型
 */
export interface JobSwitchForm {
  id?: number
  status?: number
}

/**
 * 任务列表实体类型
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
 * 任务列表数组类型
 */
export type JobRecords = JobRecord[]

/**
 * 任务响应返回类型
 */
export interface JobResponseData extends ResponseData {
  data: {
    records: JobRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 任务列表查询类型
 */
export interface JobQuery extends PageQuery {
  jobName?: string
  status?: number
}
