/**
 * @author: gaoweixuan
 * @since: 2024-02-28
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 任务日志列表类型声明
 */
export interface JLogRecord {
  id?: number
  jLogName?: string
  jLogGroupName?: string
  cronExpression?: string
  clazzName?: string
  concurrent: number
  status: number
  misfirePolicy: number
}

/**
 * 任务日志列表数组类型声明
 */
export type JLogRecords = JLogRecord[]

/**
 * 任务日志列表接口响应类型声明
 */
export interface JLogResponseData extends ResponseData {
  data: {
    records: JLogRecords | JLogRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 任务日志列表查询类型声明
 */
export interface JLogQuery extends PageQuery {
  jobId?: number
}
