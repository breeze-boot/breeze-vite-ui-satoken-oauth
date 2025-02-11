/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { PlatformResponseData, PlatformQuery, PlatformRecord, PlatformForm } from './type'
import { ResponseData, SelectResponseData } from '@/types/types.ts'

enum API {
  PLATFORM_RESTFUL_URL = '/auth/v1/platform',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: PlatformQuery): AxiosPromise<PlatformResponseData> {
  return request({
    url: `${API.PLATFORM_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getPlatform(id: number): AxiosPromise<PlatformResponseData> {
  return request({
    url: `${API.PLATFORM_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addPlatform(data: PlatformForm): AxiosPromise<ResponseData> {
  return request({
    url: API.PLATFORM_RESTFUL_URL,
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
export function editPlatform(id: number, data: PlatformForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.PLATFORM_RESTFUL_URL}/${id}`,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deletePlatform(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.PLATFORM_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: PlatformRecord): AxiosPromise<any> {
  return request({
    url: API.PLATFORM_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 校验平台编码是否重复
 *
 *  @param platformCode
 *  @param platformId
 */
export function checkPlatformCode(platformCode: string, platformId?: number): AxiosPromise<any> {
  return request({
    url: `${API.PLATFORM_RESTFUL_URL}/checkPlatformCode`,
    method: 'get',
    params: {
      platformId: platformId,
      platformCode: platformCode,
    },
  })
}

/**
 * 平台下拉框
 *
 */
export function selectPlatform(): AxiosPromise<SelectResponseData> {
  return request({
    url: `${API.PLATFORM_RESTFUL_URL}/selectPlatform`,
    method: 'get',
  })
}
