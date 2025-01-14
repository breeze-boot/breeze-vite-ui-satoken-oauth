/**
 * @author: gaoweixuan
 * @since: 2024-07-14
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import {
  MSubjectResponseData,
  MSubjectQuery,
  MSubjectRecord,
  MSubjectForm,
  MSubjectSwitchForm,
  SetUserMSubjectForm,
} from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  EMAIL_RESULT_URL = '/sys/v1/mSubject',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: MSubjectQuery): AxiosPromise<MSubjectResponseData> {
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
export function getMSubject(id: number): AxiosPromise<MSubjectResponseData> {
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
export function addMSubject(data: MSubjectForm): AxiosPromise<ResponseData> {
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
export function editMSubject(id: number, data: MSubjectForm): AxiosPromise<ResponseData> {
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
export function deleteMSubject(ids: number[]): AxiosPromise<ResponseData> {
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
export function exportExcel(params: MSubjectRecord): AxiosPromise<any> {
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
export function open(data: MSubjectSwitchForm): AxiosPromise<ResponseData> {
  return request({
    url: API.EMAIL_RESULT_URL + `/open`,
    method: 'put',
    data: data,
  })
}

/**
 * 设置邮箱的发送人抄送人
 *
 * @param id
 * @param data
 */
export function setEmailUser(id: number, data: SetUserMSubjectForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.EMAIL_RESULT_URL}/setEmailUser/${id}`,
    method: 'put',
    data: data,
  })
}

/**
 * 查询邮箱接收人
 *
 * @param id
 */
export function listToEmailUser(id: number): AxiosPromise<ResponseData> {
  return request({
    url: `${API.EMAIL_RESULT_URL}/listToEmailUser/${id}`,
    method: 'get',
  })
}

/**
 * 查询邮箱的抄送人
 *
 * @param id
 */
export function listCcEmailUser(id: number): AxiosPromise<ResponseData> {
  return request({
    url: `${API.EMAIL_RESULT_URL}/listCcEmailUser/${id}`,
    method: 'get',
  })
}
