/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 日志列表类型声明
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
 * 日志列表数组类型声明
 */
export type LogRecords = LogRecord[]

/**
 * 日志列表接口响应类型声明
 */
export interface LogResponseData extends ResponseData {
  data: {
    records: LogRecords | LogRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 日志列表查询类型声明
 */
export interface LogQuery extends PageQuery {
  doType?: number
  logType?: number
  systemModule?: string
  result?: string
  createBy?: string
  searchDate?: string
}
