/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { RoleQuery, RoleResponseData } from './type'

enum API {
  MENU_RESTFUL_URL = '/role',
}

/**
 * 列表
 *
 * @param params 角色查询参数
 */
export function page(params: RoleQuery): AxiosPromise<RoleResponseData> {
  return request({
    url: API.MENU_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}
