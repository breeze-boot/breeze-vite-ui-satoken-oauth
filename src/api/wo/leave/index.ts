/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { LeaveResponseData, LeaveQuery, LeaveRecord } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  LEAVE_RESTFUL_URL = '/wo/v1/leave',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: LeaveQuery): AxiosPromise<LeaveResponseData> {
  return request({
    url: `${API.LEAVE_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getLeave(id: number): AxiosPromise<LeaveResponseData> {
  return request({
    url: `${API.LEAVE_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addLeave(data: LeaveRecord): AxiosPromise<ResponseData> {
  return request({
    url: API.LEAVE_RESTFUL_URL,
    method: 'post',
    data,
  })
}

/**
 * 编辑
 *
 * @param data
 */
export function editLeave(data: LeaveRecord): AxiosPromise<ResponseData> {
  return request({
    url: API.LEAVE_RESTFUL_URL,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteLeave(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.LEAVE_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: LeaveRecord): AxiosPromise<any> {
  return request({
    url: API.LEAVE_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}
