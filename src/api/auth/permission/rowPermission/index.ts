/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { RowPermissionResponseData, RowPermissionQuery, RowPermissionForm } from './type'

enum API {
  PERMISSION_RESTFUL_URL = '/auth/v1/rowPermission',
  CHECK_PERMISSION_CODE_URL = '/auth/v1/rowPermission/checkRowPermissionCode',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: RowPermissionQuery): AxiosPromise<RowPermissionResponseData> {
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
export function getPermission(id: number): AxiosPromise<RowPermissionResponseData> {
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
export function addPermission(data: RowPermissionForm): AxiosPromise<RowPermissionResponseData> {
  return request({
    url: API.PERMISSION_RESTFUL_URL,
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
export function editPermission(id: number, data: RowPermissionForm): AxiosPromise<RowPermissionResponseData> {
  return request({
    url: `${API.PERMISSION_RESTFUL_URL}/${id}`,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deletePermission(ids: number[]): AxiosPromise<RowPermissionResponseData> {
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
export function exportExcel(params: RowPermissionQuery): AxiosPromise<RowPermissionResponseData> {
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
