/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 消息模板列表实体类型
 */
export interface MsgTemplate {
  id: number
  createTime: string
  updateTime: string
}

/**
 * 消息模板列表数组类型
 */
export type MsgTemplateRecords = MsgTemplate[]

/**
 * 消息模板响应返回类型
 */
export interface MsgTemplateResponseData extends ResponseData {
  data: {
    records: MsgTemplateRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 消息模板列表查询类型
 */
export interface MsgTemplateQuery extends PageQuery {
  keywords?: string
  status?: number
  startTime?: string
  endTime?: string
}
