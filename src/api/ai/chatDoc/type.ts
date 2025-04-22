/**
 * @author: gaoweixuan
 * @since: 2025-04-22
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 聊天文档列表类型声明
 */
export interface AiChatDocRecord {
  id: number
  docId: string
  docName: string
  docUrl: string
  refDocId: string
}

/**
 * 聊天文档列表数组类型声明
 */
export type AiChatDocRecords = AiChatDocRecord[]

/**
 * 聊天文档列表接口响应类型声明
 */
export interface AiChatDocResponseData extends ResponseData {
  data: {
    records: AiChatDocRecords | AiChatDocRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 聊天文档列表查询类型声明
 */
export interface AiChatDocQuery extends PageQuery {
  docName: string
}

/**
 * 聊天文档表单类型声明
 */
export interface AiChatDocForm {
  id?: number
  docId: string
  docName: string
  docUrl: string
  refDocId: string
}
