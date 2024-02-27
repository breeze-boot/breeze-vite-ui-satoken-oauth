/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { PermissionResponseData, PermissionQuery, PermissionRecord } from './type'

enum API {
  PERMISSION_RESTFUL_URL = '/permission',
  CHECK_PERMISSION_CODE_URL = '/permission/checkPermissionCode',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: PermissionQuery): AxiosPromise<PermissionResponseData> {
  return request({
    url: API.PERMISSION_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getPermission(id: number): AxiosPromise<PermissionResponseData> {
  return request({
    url: `${API.PERMISSION_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addPermission(data: PermissionRecord): AxiosPromise<PermissionResponseData> {
  return request({
    url: API.PERMISSION_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param data
 */
export function editPermission(data: PermissionRecord): AxiosPromise<PermissionResponseData> {
  return request({
    url: API.PERMISSION_RESTFUL_URL,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deletePermission(ids: number[]): AxiosPromise<PermissionResponseData> {
  return request({
    url: API.PERMISSION_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: PermissionQuery): AxiosPromise<PermissionResponseData> {
  return request({
    url: API.PERMISSION_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 校验权限编码是否重复
 *
 *  @param permissionCode
 *  @param permissionId
 */
export function checkPermissionCode(permissionCode: string, permissionId?: number): AxiosPromise<any> {
  return request({
    url: API.CHECK_PERMISSION_CODE_URL,
    method: 'get',
    params: {
      permissionId,
      permissionCode,
    },
  })
}
