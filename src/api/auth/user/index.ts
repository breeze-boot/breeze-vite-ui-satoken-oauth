/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { UserResponseData, UserQuery, User, UserSwitchForm } from './type'

enum API {
  USER_RESTFUL_URL = '/user',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: UserQuery): AxiosPromise<UserResponseData> {
  return request({
    url: API.USER_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * switch激活
 *
 * @param data
 */
export function open(data: UserSwitchForm): AxiosPromise<UserResponseData> {
  return request({
    url: API.USER_RESTFUL_URL + `/open`,
    method: 'put',
    data: data,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getUser(id: number): AxiosPromise<UserResponseData> {
  return request({
    url: API.USER_RESTFUL_URL,
    method: 'get',
    params: id,
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addUser(data: User): AxiosPromise<UserResponseData> {
  return request({
    url: API.USER_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param data
 */
export function editUser(data: User): AxiosPromise<UserResponseData> {
  return request({
    url: API.USER_RESTFUL_URL,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteUser(ids: number[]): AxiosPromise<UserResponseData> {
  return request({
    url: API.USER_RESTFUL_URL,
    method: 'delete',
    params: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: UserQuery): AxiosPromise<UserResponseData> {
  return request({
    url: API.USER_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}
