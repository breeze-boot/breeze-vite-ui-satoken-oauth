/**
 * @author: gaoweixuan
 * @since: 2025-02-15
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 日志列表类型声明
 */
export interface AuditLogRecord {
  id?: number
}

/**
 * 日志列表数组类型声明
 */
export type AuditLogRecords = AuditLogRecord[]

/**
 * 日志列表接口响应类型声明
 */
export interface AuditLogResponseData extends ResponseData {
  data: {
    records: AuditLogRecords | AuditLogRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 日志列表查询类型声明
 */
export interface AuditLogQuery extends PageQuery {
  searchDate?: string
}
