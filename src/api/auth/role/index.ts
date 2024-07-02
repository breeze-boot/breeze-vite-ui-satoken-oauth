/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { RoleResponseData, RoleQuery, RoleRecord, ColumnPermissionRecord } from './type'
import { ResponseData, SelectResponseData } from '@/types/types.ts'

enum API {
  ROLE_RESTFUL_URL = '/auth/v1/role',
  CHECK_ROLE_CODE_URL = '/auth/v1/role/checkRoleCode',
  SELECT_PERMISSION_URL = '/sys/v1/common/selectPermission',
  SELECT_CUSTOMIZE_PERMISSION_URL = '/sys/v1/common/selectCustomizePermission',
  SELECT_TABLE_URL = '/sys/v1/common/selectTable',
  SELECT_TABLE_COLUMN_URL = '/sys/v1/common/selectTableColumn',
  SET_COLUMN_PERMISSION_RESTFUL_URL = '/auth/v1/columnPermission/setColumnPermission',
  LIST_COLUMN_PERMISSION_RESTFUL_URL = '/auth/v1/columnPermission/listSetColumnPermission',
  REMOVE_COLUMN_PERMISSION_RESTFUL_URL = '/auth/v1/columnPermission/removeColumnPermission',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: RoleQuery): AxiosPromise<RoleResponseData> {
  return request({
    url: API.ROLE_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getRole(id: number): AxiosPromise<RoleResponseData> {
  return request({
    url: `${API.ROLE_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addRole(data: RoleRecord): AxiosPromise<ResponseData> {
  return request({
    url: API.ROLE_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param data
 */
export function editRole(data: RoleRecord): AxiosPromise<ResponseData> {
  return request({
    url: API.ROLE_RESTFUL_URL,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteRole(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.ROLE_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: RoleQuery): AxiosPromise<any> {
  return request({
    url: API.ROLE_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 校验角色编码是否重复
 *
 *  @param roleCode
 *  @param roleId
 */
export function checkRoleCode(roleCode: string, roleId?: number): AxiosPromise<any> {
  return request({
    url: API.CHECK_ROLE_CODE_URL,
    method: 'get',
    params: {
      roleId: roleId,
      roleCode: roleCode,
    },
  })
}

/**
 * 查询用户角色
 *
 * @param id
 */
export function listUserRoles(id: number): AxiosPromise<any> {
  return request({
    url: `${API.ROLE_RESTFUL_URL}/listUserRoles`,
    method: 'get',
    params: {
      id,
    },
  })
}

/**
 * 获取角色权限
 *
 * @param roleId
 * @returns {AxiosPromise}
 */
export function listRolesPermission(roleId: number): AxiosPromise<ResponseData> {
  return request({
    url: `${API.ROLE_RESTFUL_URL}/listRolesPermission`,
    method: 'get',
    params: { roleId },
  })
}

/**
 * 修改角色权限
 *
 * @param data
 */
export function modifyPermission(data: any): AxiosPromise<ResponseData> {
  return request({
    url: `${API.ROLE_RESTFUL_URL}/modifyPermission`,
    method: 'put',
    data: data,
  })
}

/**
 * 权限下拉框
 */
export function selectPermission(): AxiosPromise<SelectResponseData> {
  return request({
    url: API.SELECT_PERMISSION_URL,
    method: 'get',
  })
}

/**
 * 自定义权限下拉框
 */
export function selectCustomizePermission(): AxiosPromise<SelectResponseData> {
  return request({
    url: API.SELECT_CUSTOMIZE_PERMISSION_URL,
    method: 'get',
  })
}

/**
 * 表格下拉框
 */
export function selectTable(): AxiosPromise<SelectResponseData> {
  return request({
    url: API.SELECT_TABLE_URL,
    method: 'get',
  })
}

/**
 * 表格字段下拉框
 */
export function selectTableColumn(tableName: string): AxiosPromise<SelectResponseData> {
  return request({
    url: API.SELECT_TABLE_COLUMN_URL,
    method: 'get',
    params: {
      tableName,
    },
  })
}

/**
 * 回显列的数据权限
 */
export function listSetColumnPermission(roleId?: number): AxiosPromise<SelectResponseData> {
  return request({
    url: API.LIST_COLUMN_PERMISSION_RESTFUL_URL,
    method: 'get',
    params: {
      roleId,
    },
  })
}

/**
 * 设置列的数据权限
 */
export function setColumnPermission(data: ColumnPermissionRecord): AxiosPromise<SelectResponseData> {
  return request({
    url: API.SET_COLUMN_PERMISSION_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 删除列的数据权限
 */
export function removeColumnPermission(data: any): AxiosPromise<SelectResponseData> {
  return request({
    url: API.REMOVE_COLUMN_PERMISSION_RESTFUL_URL,
    method: 'delete',
    data: data,
  })
}
