/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 流程定义列表类型声明
 */
export interface FlowDefinitionRecord {
  id?: number
  xml: string
  definitionKey: string
  definitionName: string
  categoryName: string
  tenantId: string
  deploymentTime: string
  version: string
  suspended: string
}

/**
 * 流程定义列表数组类型声明
 */
export type FlowDefinitionRecords = FlowDefinitionRecord[]

/**
 * 流程定义列表接口响应类型声明
 */
export interface FlowDefinitionResponseData extends ResponseData {
  data: {
    records: FlowDefinitionRecords | FlowDefinitionRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 流程定义列表查询类型声明
 */
export interface FlowDefinitionQuery extends PageQuery {
  definitionKey: string
  definitionName: string
}

/**
 * 流程定义表单提交类型声明
 */
export interface FlowDefinitionParam {
  id?: string
  xml: string
  tenantId: string
  definitionKey: string
  definitionName: string
  categoryCode: string
  deploymentTime: string
  version: string
}

/**
 * 流程启动表单提交类型声明
 */
export interface FlowStartParam {
  definitionKey: string
  businessKey: string
  variables: object
  isPassFirstNode: boolean
  tenantId: string
}
