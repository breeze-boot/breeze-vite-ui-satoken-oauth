/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import {
  FlowDefinitionResponseData,
  FlowDefinitionQuery,
  FlowDefinitionRecord,
  FlowDefinitionParam,
  FlowStartParam,
} from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  DEFINITION_RESTFUL_URL = '/flow/v1/definition',
  DEFINITION_FLOW_DESIGN_URL = '/flow/v1/definition/v1/design',
  INSTANCE_FLOW_START_URL = '/flow/v1/instance/start',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: FlowDefinitionQuery): AxiosPromise<FlowDefinitionResponseData> {
  return request({
    url: API.DEFINITION_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getDefinition(id: number): AxiosPromise<FlowDefinitionResponseData> {
  return request({
    url: `${API.DEFINITION_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 发布
 *
 * @param definitionParam
 */
export function deployDefinition(definitionParam: FlowDefinitionParam): AxiosPromise<ResponseData> {
  return request({
    url: API.DEFINITION_FLOW_DESIGN_URL,
    method: 'post',
    data: definitionParam,
  })
}

/**
 * 启动
 *
 * @param flowStartParam
 */
export function startInstance(flowStartParam: FlowStartParam): AxiosPromise<ResponseData> {
  return request({
    url: API.INSTANCE_FLOW_START_URL,
    method: 'post',
    data: flowStartParam,
  })
}

/**
 * 删除
 *
 * @param definitions
 */
export function deleteDefinition(definitions: any[]): AxiosPromise<ResponseData> {
  return request({
    url: API.DEFINITION_RESTFUL_URL,
    method: 'delete',
    data: definitions,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: FlowDefinitionRecord): AxiosPromise<any> {
  return request({
    url: API.DEFINITION_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}
