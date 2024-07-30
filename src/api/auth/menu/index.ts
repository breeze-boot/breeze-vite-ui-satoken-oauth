/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import JSONBigInt from 'json-bigint'
import type { MenuResponseData, MenuQuery, MenuTreeResponseData, MenuForm } from './type'
import { SelectResponseData } from '@/types/types.ts'

enum API {
  MENU_RESTFUL_URL = '/auth/v1/menu',
  MENU_SELECT_URL = '/sys/v1/common/selectMenu',
}

/**
 * 列表
 *
 * @param params
 */
export function list(params: MenuQuery): AxiosPromise<MenuResponseData> {
  return request({
    url: API.MENU_RESTFUL_URL,
    method: 'get',
    params: {
      ...params,
      platformId: JSONBigInt.parse('1111111111111111111'),
    },
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getMenu(id: number): AxiosPromise<MenuResponseData> {
  return request({
    url: `${API.MENU_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addMenu(data: MenuForm): AxiosPromise<MenuResponseData> {
  return request({
    url: API.MENU_RESTFUL_URL,
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
export function editMenu(id: number, data: MenuForm): AxiosPromise<MenuResponseData> {
  return request({
    url: `${API.MENU_RESTFUL_URL}/${id}`,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteMenu(ids: number[]): AxiosPromise<MenuResponseData> {
  return request({
    url: API.MENU_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: MenuQuery): AxiosPromise<MenuResponseData> {
  return request({
    url: API.MENU_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 菜单下拉框
 *
 * @param id
 */
export function selectMenu(id: number): AxiosPromise<SelectResponseData> {
  return request({
    url: API.MENU_SELECT_URL,
    method: 'get',
    params: { id },
  })
}

/**
 * 权限列表
 */
export function listTreePermission(type: number[]): AxiosPromise<MenuTreeResponseData> {
  return request({
    url: `${API.MENU_RESTFUL_URL}/listTreePermission`,
    method: 'post',
    data: type,
  })
}
