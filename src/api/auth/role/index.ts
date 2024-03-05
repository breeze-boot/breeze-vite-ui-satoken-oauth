/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { RoleResponseData, RoleQuery, RoleRecord } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  ROLE_RESTFUL_URL = '/role',
  CHECK_ROLE_CODE_URL = '/role/checkRoleCode',
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
export function addRole(data: RoleRecord): AxiosPromise<RoleResponseData> {
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
export function editRole(data: RoleRecord): AxiosPromise<RoleResponseData> {
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
export function deleteRole(ids: number[]): AxiosPromise<RoleResponseData> {
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
export function exportExcel(params: RoleQuery): AxiosPromise<RoleResponseData> {
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
