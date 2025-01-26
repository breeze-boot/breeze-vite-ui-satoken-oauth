/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { RoleResponseData, RoleQuery, RoleForm, ModifyPermissionForm } from './type'
import { ResponseData, SelectResponseData } from '@/types/types.ts'

enum API {
  ROLE_RESTFUL_URL = '/auth/v1/role',
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
export function addRole(data: RoleForm): AxiosPromise<ResponseData> {
  return request({
    url: API.ROLE_RESTFUL_URL,
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
export function editRole(id: number, data: RoleForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.ROLE_RESTFUL_URL}/${id}`,
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
    url: `${API.ROLE_RESTFUL_URL}/checkRoleCode`,
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
export function modifyPermission(data: ModifyPermissionForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.ROLE_RESTFUL_URL}/modifyPermission`,
    method: 'put',
    data,
  })
}

/**
 * 角色下拉框
 */
export function selectRole(): AxiosPromise<SelectResponseData> {
  return request({
    url: `${API.ROLE_RESTFUL_URL}/selectRole`,
    method: 'get',
  })
}
