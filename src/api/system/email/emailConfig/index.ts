/**
 * @author: gaoweixuan
 * @since: 2024-07-14
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import {
  EmailConfigResponseData,
  EmailConfigQuery,
  EmailConfigRecord,
  EmailConfigForm,
  EmailConfigSwitchForm,
} from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  EMAIL_CONFIG_RESULT_URL = '/sys/v1/emailConfig',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: EmailConfigQuery): AxiosPromise<EmailConfigResponseData> {
  return request({
    url: API.EMAIL_CONFIG_RESULT_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getEmailConfig(id: number): AxiosPromise<EmailConfigResponseData> {
  return request({
    url: `${API.EMAIL_CONFIG_RESULT_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addEmailConfig(data: EmailConfigForm): AxiosPromise<ResponseData> {
  return request({
    url: API.EMAIL_CONFIG_RESULT_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param id
 * @param data
 */
export function editEmailConfig(id: number, data: EmailConfigForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.EMAIL_CONFIG_RESULT_URL}/${id}`,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteEmailConfig(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.EMAIL_CONFIG_RESULT_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: EmailConfigRecord): AxiosPromise<any> {
  return request({
    url: API.EMAIL_CONFIG_RESULT_URL,
    method: 'post',
    data: params,
  })
}

/**
 * switch激活
 *
 * @param data
 */
export function open(data: EmailConfigSwitchForm): AxiosPromise<ResponseData> {
  return request({
    url: API.EMAIL_CONFIG_RESULT_URL + `/open`,
    method: 'put',
    data: data,
  })
}
