/**
 * @author: gaoweixuan
 * @since: 2025-07-20
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 系统参数配置表列表类型声明
 */
export interface ConfigRecord {
  id: any
  paramCateg: string
  paramName: string
  paramValue: string
  envCode: string
  dataType: string
  isRequired: any
  description: string
  status: number
}

/**
 * 系统参数配置表列表数组类型声明
 */
export type ConfigRecords = ConfigRecord[]

/**
 * 系统参数配置表列表接口响应类型声明
 */
export interface ConfigResponseData extends ResponseData {
  data: {
    records: ConfigRecords | ConfigRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 系统参数配置表列表查询类型声明
 */
export interface ConfigQuery extends PageQuery {
  id: any
  categId?: number
  paramCateg: string
  paramName: string
  paramValue: string
  envCode: string
  dataType: string
  isRequired: any
  description: string
  status: number
}

/**
 * 系统参数配置表表单类型声明
 */
export interface ConfigForm {
  id: any
  paramCateg?: string
  paramName?: string
  paramValue?: string
  envCode?: string
  dataType?: string
  isRequired: any
  description?: string
  status: number
}
