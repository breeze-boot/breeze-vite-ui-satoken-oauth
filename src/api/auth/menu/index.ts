/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { MenuQuery, MenuResponseData } from './type'

enum API {
  MENU_RESTFUL_URL = '/menu',
}

/**
 * 列表
 *
 * @param params 菜单查询参数
 */
export function page(params: MenuQuery): AxiosPromise<MenuResponseData> {
  return request({
    url: API.MENU_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}
