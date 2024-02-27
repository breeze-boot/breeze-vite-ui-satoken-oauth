/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 任务列表实体类型
 */
export interface LogRecord {
  id?: number
  systemModule: string
  logTitle: string
  logType: number
  doType: number
  requestType: string
  result: string
  browser: string
  system: string
  ip: string
  createBy: string
}

/**
 * 任务列表数组类型
 */
export type LogRecords = LogRecord[]

/**
 * 任务响应返回类型
 */
export interface LogResponseData extends ResponseData {
  data: {
    records: LogRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 任务列表查询类型
 */
export interface LogQuery extends PageQuery {
  doType?: number
  logType?: number
  systemModule?: string
  result?: string
  createBy?: string
  searchDate?: string
}
