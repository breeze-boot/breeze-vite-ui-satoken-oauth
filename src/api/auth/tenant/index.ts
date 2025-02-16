/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { TenantResponseData, TenantQuery, TenantForm } from './type'
import { ResponseData, SelectResponseData } from '@/types/types.ts'

enum API {
  TENANT_RESTFUL_URL = '/auth/v1/tenant',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: TenantQuery): AxiosPromise<TenantResponseData> {
  return request({
    url: `${API.TENANT_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getTenant(id: number): AxiosPromise<TenantResponseData> {
  return request({
    url: `${API.TENANT_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addTenant(data: TenantForm): AxiosPromise<ResponseData> {
  return request({
    url: API.TENANT_RESTFUL_URL,
    method: 'post',
    data,
  })
}

/**
 * 编辑
 *
 * @param id
 * @param data
 */
export function editTenant(id: number, data: TenantForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.TENANT_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteTenant(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.TENANT_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: TenantQuery): AxiosPromise<any> {
  return request({
    url: API.TENANT_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 校验租户编码是否重复
 *
 *  @param tenantCode
 *  @param tenantId
 */
export function checkTenantCode(tenantCode: string, tenantId?: number): AxiosPromise<any> {
  return request({
    url: `${API.TENANT_RESTFUL_URL}/checkTenantCode`,
    method: 'get',
    params: {
      tenantId: tenantId,
      tenantCode: tenantCode,
    },
  })
}

/**
 * 租户下拉框
 *
 */
export function selectTenant(): AxiosPromise<SelectResponseData> {
  return request({
    url: `${API.TENANT_RESTFUL_URL}/selectTenant`,
    method: 'get',
  })
}
