/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { MenuColumnResponseData, MenuColumnQuery, RoleMenuColumnForm } from './type'
import { ColumnCacheData, ResponseData } from '@/types/types.ts'

enum API {
  MENU_COLUMN_RESTFUL_URL = '/auth/v1/menuColumn',
  ROLE_MENU_COLUMN_URL = '/auth/v1/roleMenuColumn',
  ROLE_MENU_COLUMN_RESTFUL_URL = '/auth/v1/roleMenuColumn',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: MenuColumnQuery): AxiosPromise<MenuColumnResponseData> {
  return request({
    url: API.MENU_COLUMN_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteMenuColumn(ids: number[]): AxiosPromise<MenuColumnResponseData> {
  return request({
    url: API.MENU_COLUMN_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: MenuColumnQuery): AxiosPromise<MenuColumnResponseData> {
  return request({
    url: API.MENU_COLUMN_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 获取当前角色的隐藏列
 */
export function getRolesMenuColumns() {
  return request({
    url: `${API.MENU_COLUMN_RESTFUL_URL}/getRolesMenuColumns`,
    method: 'get',
  })
}

/**
 * @param data
 *
 * 保存菜单列
 */
export function saveMenuColumn(data: ColumnCacheData) {
  return request({
    url: `${API.MENU_COLUMN_RESTFUL_URL}`,
    method: 'post',
    data,
  })
}

/**
 * @param data
 *
 * 保存角色菜单列
 */
export function saveRoleMenuColumn(data: RoleMenuColumnForm) {
  return request({
    url: `${API.ROLE_MENU_COLUMN_RESTFUL_URL}`,
    method: 'post',
    data,
  })
}

/**
 * 获取角色菜单列权限列表回显
 *
 * @param roleId
 * @returns {AxiosPromise}
 */
export function listRolesMenuColumnPermission(roleId: number): AxiosPromise<ResponseData> {
  return request({
    url: `${API.ROLE_MENU_COLUMN_URL}/listRolesMenuColumnPermission`,
    method: 'get',
    params: { roleId },
  })
}
