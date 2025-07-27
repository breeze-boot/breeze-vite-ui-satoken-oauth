/**
 * @author: gaoweixuan
 * @since: 2025-07-20
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 系统环境配置表管理列表类型声明
 */
export interface ConfigEnvRecord {
  id: any
  envCode: string
  envName: string
  description: string
}

/**
 * 系统环境配置表管理列表数组类型声明
 */
export type SysConfigEnvRecords = ConfigEnvRecord[]

/**
 * 系统环境配置表管理列表接口响应类型声明
 */
export interface ConfigEnvResponseData extends ResponseData {
  data: {
    records: SysConfigEnvRecords | ConfigEnvRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 系统环境配置表管理列表查询类型声明
 */
export interface ConfigEnvQuery extends PageQuery {
  id: any
  envCode: string
  envName: string
  description: string
}

/**
 * 系统环境配置表管理表单类型声明
 */
export interface ConfigEnvForm {
  id: any
  envCode?: string
  envName?: string
  description?: string
}
