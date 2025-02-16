/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 日志列表类型声明
 */
export interface SysLogRecord {
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
 * 系统日志列表数组类型声明
 */
export type SysLogRecords = SysLogRecord[]

/**
 * 系统日志列表接口响应类型声明
 */
export interface SysLogResponseData extends ResponseData {
  data: {
    records: SysLogRecords | SysLogRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 系统日志列表查询类型声明
 */
export interface SysLogQuery extends PageQuery {
  doType?: number
  logType?: number
  systemModule?: string
  result?: string
  createBy?: string
  searchDate?: string
}
