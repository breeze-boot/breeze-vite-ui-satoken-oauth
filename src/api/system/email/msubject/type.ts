/**
 * @author: gaoweixuan
 * @since: 2024-07-14
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 邮箱主题列表类型声明
 */
export interface MSubjectRecord {
  id?: number
  subject: string
  to: string
  content: string
  cc: string
  status?: number
}

/**
 * 邮箱主题列表数组类型声明
 */
export type MSubjectRecords = MSubjectRecord[]

/**
 * 邮箱主题列表接口响应类型声明
 */
export interface MSubjectResponseData extends ResponseData {
  data: {
    records: MSubjectRecords | MSubjectRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 邮箱主题列表查询类型声明
 */
export interface MSubjectQuery extends PageQuery {
  subject: string
}

/**
 * 邮箱主题表单类型声明
 */
export interface MSubjectForm {
  id?: number
  subject: string
  content: string
  to: string
  toUserId: number[]
  cc: string
  ccUserId: number[]
  status?: number
}

/**
 * 用户列表查询类型声明
 */
export interface EmailSetUserQuery extends PageQuery {
  id: number
  column: string
  userCode: string
  username: string
  email: string
}

/**
 * 邮箱主题switch锁定开启参数类型声明
 */
export interface MSubjectSwitchForm {
  id?: number
  status?: number
}

/**
 * 邮箱设置发送人抄送人表单类型声明
 */
export interface SetUserMSubjectForm {
  toUserId: number[]
  ccUserId: number[]
}
