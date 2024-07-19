/**
 * @author: gaoweixuan
 * @since: 2024-07-14
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 邮箱列表类型声明
 */
export interface EmailConfigRecord {
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
export type EmailConfigRecords = EmailConfigRecord[]

/**
 * 邮箱列表接口响应类型声明
 */
export interface EmailConfigResponseData extends ResponseData {
  data: {
    records: EmailConfigRecords | EmailConfigRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 邮箱列表查询类型声明
 */
export interface EmailConfigQuery extends PageQuery {
  username: string
}

/**
 * 邮箱表单类型声明
 */
export interface EmailConfigForm {
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
export interface EmailConfigSwitchForm {
  id?: number
  status?: number
}
