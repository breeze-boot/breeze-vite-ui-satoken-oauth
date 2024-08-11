/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import {
  BpmDefinitionResponseData,
  BpmDefinitionQuery,
  BpmDefinitionRecord,
  BpmDefinitionForm,
  BpmStartForm,
} from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  DEFINITION_RESTFUL_URL = '/bpm/v1/definition',
  BPM_INSTANCE_START_URL = '/bpm/v1/instance/start',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: BpmDefinitionQuery): AxiosPromise<BpmDefinitionResponseData> {
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
export function getDefinition(id: number): AxiosPromise<BpmDefinitionResponseData> {
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
export function deployDefinition(definitionParam: BpmDefinitionForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.DEFINITION_RESTFUL_URL}/v1/design`,
    method: 'post',
    data: definitionParam,
  })
}

/**
 * 启动
 *
 * @param bpmStartForm
 */
export function startInstance(bpmStartForm: BpmStartForm): AxiosPromise<ResponseData> {
  return request({
    url: API.BPM_INSTANCE_START_URL,
    method: 'post',
    data: bpmStartForm,
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
export function exportExcel(params: BpmDefinitionRecord): AxiosPromise<any> {
  return request({
    url: API.DEFINITION_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * switch激活
 *
 * @param params
 */
export function suspendedDefinition(params: any): AxiosPromise<ResponseData> {
  debugger
  return request({
    url: API.DEFINITION_RESTFUL_URL + `/suspendedDefinition`,
    method: 'put',
    params,
  })
}

/**
 * 获取流程xml
 *
 * @param procInstId
 */
export function getBpmDefinitionXml(procInstId: string): AxiosPromise<BpmDefinitionResponseData> {
  return request({
    url: `${API.DEFINITION_RESTFUL_URL}/getBpmDefinitionXml`,
    method: 'get',
    params: {
      procInstId,
    },
  })
}

/**
 * 获取流程图
 *
 * @param procInstId
 */
export function getBpmDefinitionPng(procInstId: string): AxiosPromise<BpmDefinitionResponseData> {
  return request({
    url: `${API.DEFINITION_RESTFUL_URL}/getBpmDefinitionPng`,
    method: 'get',
    params: {
      procInstId,
    },
  })
}
