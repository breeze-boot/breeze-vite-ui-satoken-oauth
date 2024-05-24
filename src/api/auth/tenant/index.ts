/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { TenantResponseData, TenantQuery, TenantRecord } from './type'
import { SelectResponseData } from '@/types/types.ts'

enum API {
  TENANT_RESTFUL_URL = '/tenant',
  CHECK_TENANT_CODE_URL = '/tenant/checkTenantCode',
  TENANT_SELECT_URL = '/common/selectTenant',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: TenantQuery): AxiosPromise<TenantResponseData> {
  return request({
    url: API.TENANT_RESTFUL_URL,
    method: 'get',
    params: params,
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
export function addTenant(data: TenantRecord): AxiosPromise<TenantResponseData> {
  return request({
    url: API.TENANT_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param data
 */
export function editTenant(data: TenantRecord): AxiosPromise<TenantResponseData> {
  return request({
    url: API.TENANT_RESTFUL_URL,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteTenant(ids: number[]): AxiosPromise<TenantResponseData> {
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
export function exportExcel(params: TenantQuery): AxiosPromise<TenantResponseData> {
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
    url: API.CHECK_TENANT_CODE_URL,
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
    url: API.TENANT_SELECT_URL,
    method: 'get',
  })
}
