/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 租户列表实体类型
 */
export interface TenantRecord {
  id?: number
  tenantName?: string
  tenantCode?: string
}

/**
 * 租户列表数组类型
 */
export type TenantRecords = TenantRecord[]

/**
 * 租户响应返回类型
 */
export interface TenantResponseData extends ResponseData {
  data: {
    records: TenantRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 租户列表查询类型
 */
export interface TenantQuery extends PageQuery {
  tenantCode: string
  tenantName: string
}
