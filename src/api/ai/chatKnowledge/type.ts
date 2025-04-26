/**
 * @author: gaoweixuan
 * @since: 2025-04-22
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 聊天知识库文档列表类型声明
 */
export interface AiChatKnowledgeRecord {
  id: number
  docId: string
  docName: string
  docUrl: string
  refKnowledgeId: string
}

/**
 * 聊天知识库文档列表数组类型声明
 */
export type AiChatKnowledgeRecords = AiChatKnowledgeRecord[]

/**
 * 聊天知识库文档列表接口响应类型声明
 */
export interface AiChatKnowledgeResponseData extends ResponseData {
  data: {
    records: AiChatKnowledgeRecords | AiChatKnowledgeRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 聊天知识库文档列表查询类型声明
 */
export interface AiChatKnowledgeQuery extends PageQuery {
  docName: string
}
