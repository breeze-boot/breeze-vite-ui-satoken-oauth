/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { PlatformResponseData, PlatformQuery, PlatformRecord } from './type'
import { SelectResponseData } from '@/types/types.ts'

enum API {
  PLATFORM_RESTFUL_URL = '/platform',
  CHECK_PLATFORM_CODE_URL = '/platform/checkPlatformCode',
  PLATFORM_SELECT_URL = '/common/selectPlatform',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: PlatformQuery): AxiosPromise<PlatformResponseData> {
  return request({
    url: API.PLATFORM_RESTFUL_URL,
    method: 'get',
    params: params,
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
export function addPlatform(data: PlatformRecord): AxiosPromise<PlatformResponseData> {
  return request({
    url: API.PLATFORM_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param data
 */
export function editPlatform(data: PlatformRecord): AxiosPromise<PlatformResponseData> {
  return request({
    url: API.PLATFORM_RESTFUL_URL,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deletePlatform(ids: number[]): AxiosPromise<PlatformResponseData> {
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
export function exportExcel(params: PlatformRecord): AxiosPromise<PlatformResponseData> {
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
    url: API.CHECK_PLATFORM_CODE_URL,
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
    url: API.PLATFORM_SELECT_URL,
    method: 'get',
  })
}
