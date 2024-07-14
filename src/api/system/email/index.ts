/**
 * @author: gaoweixuan
 * @since: 2024-07-14
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { EmailResponseData, EmailQuery, EmailRecord, EmailForm, EmailSwitchForm } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  EMAIL_RESULT_URL = '/sys/v1/email',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: EmailQuery): AxiosPromise<EmailResponseData> {
  return request({
    url: API.EMAIL_RESULT_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getEmail(id: number): AxiosPromise<EmailResponseData> {
  return request({
    url: `${API.EMAIL_RESULT_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addEmail(data: EmailForm): AxiosPromise<ResponseData> {
  return request({
    url: API.EMAIL_RESULT_URL,
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
export function editEmail(id: number, data: EmailForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.EMAIL_RESULT_URL}/${id}`,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteEmail(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.EMAIL_RESULT_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: EmailRecord): AxiosPromise<any> {
  return request({
    url: API.EMAIL_RESULT_URL,
    method: 'post',
    data: params,
  })
}

/**
 * switch激活
 *
 * @param data
 */
export function open(data: EmailSwitchForm): AxiosPromise<ResponseData> {
  return request({
    url: API.EMAIL_RESULT_URL + `/open`,
    method: 'put',
    data: data,
  })
}
