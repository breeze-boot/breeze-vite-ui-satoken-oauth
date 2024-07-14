/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 租户列表类型声明
 */
export interface TenantRecord {
  id?: number
  tenantName?: string
  tenantCode?: string
}

/**
 * 租户列表数组类型声明
 */
export type TenantRecords = TenantRecord[]

/**
 * 租户列表接口响应类型声明
 */
export interface TenantResponseData extends ResponseData {
  data: {
    records: TenantRecords | TenantRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 租户列表查询类型声明
 */
export interface TenantQuery extends PageQuery {
  tenantCode: string
  tenantName: string
}

/**
 * 租户表单类型声明
 */
export interface TenantForm {
  id?: number
  tenantName?: string
  tenantCode?: string
}
