/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { MenuColumnResponseData, MenuColumnQuery, RolesColumnCacheResponseData } from './type'

enum API {
  MENU_COLUMN_RESTFUL_URL = '/auth/v1/menuColumn',
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
