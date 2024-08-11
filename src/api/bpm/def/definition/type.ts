/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 流程定义列表类型声明
 */
export interface BpmDefinitionRecord {
  id?: number
  xml: string
  procDefId: string
  procDefKey: string
  procDefName: string
  categoryName: string
  tenantId: string
  deploymentTime: string
  version: string
  suspended: string
}

/**
 * 流程定义列表数组类型声明
 */
export type BpmDefinitionRecords = BpmDefinitionRecord[]

/**
 * 流程定义列表接口响应类型声明
 */
export interface BpmDefinitionResponseData extends ResponseData {
  data: {
    records: BpmDefinitionRecords | BpmDefinitionRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 流程定义列表查询类型声明
 */
export interface BpmDefinitionQuery extends PageQuery {
  procDefName?: string
  procDefKey?: string
}

/**
 * 流程定义表单提交表单类型声明
 */
export interface BpmDefinitionForm {
  id?: string
  xml: string
  procDefKey: string
  procDefName: string
  categoryCode: string
  deploymentTime: string
  version: string
}

/**
 * 流程启动表单提交表单类型声明
 */
export interface BpmStartForm {
  procDefKey: string
  businessKey: string
  variables: object
  isPassFirstNode: boolean
}
