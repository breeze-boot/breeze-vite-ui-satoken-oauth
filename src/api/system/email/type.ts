/**
 * @author: gaoweixuan
 * @since: 2024-07-14
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 邮箱列表类型声明
 */
export interface EmailRecord {
  id?: number
  smtpHost?: string
  port?: number
  username?: string
  password?: string
  encoding?: string
  smtpDebug?: string
  smtpSocketFactoryClass?: string
  auth?: string
  protocol?: string
  ssl?: string
  status?: number
}

/**
 * 邮箱列表数组类型声明
 */
export type EmailRecords = EmailRecord[]

/**
 * 邮箱列表接口响应类型声明
 */
export interface EmailResponseData extends ResponseData {
  data: {
    records: EmailRecords | EmailRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 邮箱列表查询类型声明
 */
export interface EmailQuery extends PageQuery {
  username: string
}

/**
 * 邮箱表单类型声明
 */
export interface EmailForm {
  id?: number
  smtpHost?: string
  port?: number
  username?: string
  password?: string
  encoding?: string
  smtpDebug?: string
  smtpSocketFactoryClass?: string
  auth?: string
  protocol?: string
  ssl?: string
  status?: number
}

/**
 * 邮箱switch锁定开启参数类型声明
 */
export interface EmailSwitchForm {
  id?: number
  status?: number
}
