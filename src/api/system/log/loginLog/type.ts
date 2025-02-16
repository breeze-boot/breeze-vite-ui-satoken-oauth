/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 登录日志列表类型声明
 */
export interface LoginLogRecord {
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
 * 登录日志列表数组类型声明
 */
export type LoginLogRecords = LoginLogRecord[]

/**
 * 登录日志列表接口响应类型声明
 */
export interface LoginLogResponseData extends ResponseData {
  data: {
    records: LoginLogRecords | LoginLogRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 日志列表查询类型声明
 */
export interface LoginLogQuery extends PageQuery {
  doType?: number
  logType?: number
  systemModule?: string
  result?: string
  createBy?: string
  searchDate?: string
}
