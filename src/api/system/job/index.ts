/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { JobResponseData, JobQuery, JobRecord, JobSwitchForm } from './type'

enum API {
  JOB_RESTFUL_URL = '/job',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: JobQuery): AxiosPromise<JobResponseData> {
  return request({
    url: API.JOB_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getJob(id: number): AxiosPromise<JobResponseData> {
  return request({
    url: `${API.JOB_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addJob(data: JobRecord): AxiosPromise<JobResponseData> {
  return request({
    url: API.JOB_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param data
 */
export function editJob(data: JobRecord): AxiosPromise<JobResponseData> {
  return request({
    url: API.JOB_RESTFUL_URL,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteJob(ids: number[]): AxiosPromise<JobResponseData> {
  return request({
    url: API.JOB_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: JobQuery): AxiosPromise<JobResponseData> {
  return request({
    url: API.JOB_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 运行一次
 *
 * @param jobId
 */
export function runJobNow(jobId: number): AxiosPromise<JobResponseData> {
  return request({
    url: `${API.JOB_RESTFUL_URL}/runJobNow`,
    method: 'get',
    params: {
      jobId,
    },
  })
}

/**
 * 开启暂停
 *
 * @param data
 */
export function open(data: JobSwitchForm): AxiosPromise<JobResponseData> {
  return request({
    url: `${API.JOB_RESTFUL_URL}/open`,
    method: 'put',
    data: data,
  })
}
