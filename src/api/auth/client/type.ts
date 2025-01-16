/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 客户端列表类型声明
 */
export interface ClientRecord {
  id?: number
  clientId: string
  clientName: string
  clientSecret: string
  confirmClientSecret: string
  redirectUris: string[]
  scopes: string[]
  authorizationGrantTypes: string[]
  clientAuthenticationMethods: string[]
  clientSecretExpiresAt: string
  clientIdIssuedAt: string
}

/**
 * 客户端列表数组类型声明
 */
export type ClientRecords = ClientRecord[]

/**
 * 客户端列表接口响应类型声明
 */
export interface ClientResponseData extends ResponseData {
  data: {
    records: ClientRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 客户端列表查询类型声明
 */
export interface ClientQuery extends PageQuery {
  clientCode: string
  clientName: string
}

/**
 * 客户端表单类型声明
 */
export interface ClientForm {
  id?: number
  clientId: string
  clientName: string
  clientSecret: string
  confirmClientSecret: string
  redirectUris: string[]
  scopes: string[]
  authorizationGrantTypes: string[]
  clientAuthenticationMethods: string[]
  clientSecretExpiresAt: string
  clientIdIssuedAt: string
}
