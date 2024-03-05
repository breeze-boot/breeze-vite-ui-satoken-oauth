/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import {
  UserResponseData,
  UserQuery,
  UserRecord,
  UserSwitchParam,
  UserResetPasswordParam,
  UserSetRoleParam,
} from './type'
import { SelectResponseData } from '@/types/types.ts'

enum API {
  USER_RESTFUL_URL = '/user',
  CHECK_USERNAME_URL = '/user/checkUsername',
  SELECT_DEPT_URL = '/common/selectDept',
  SELECT_POST_URL = '/common/selectPost',
  SELECT_ROLE_URL = '/common/selectRole',
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
export function open(data: UserSwitchParam): AxiosPromise<UserResponseData> {
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
    url: `${API.USER_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addUser(data: UserRecord): AxiosPromise<UserResponseData> {
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
export function editUser(data: UserRecord): AxiosPromise<UserResponseData> {
  return request({
    url: API.USER_RESTFUL_URL,
    method: 'put',
    data: data,
  })
}

/**
 * 编辑头像
 *
 * @param data
 */
export function editAvatar(data: UserRecord): AxiosPromise<UserResponseData> {
  return request({
    url: `${API.USER_RESTFUL_URL}/modifyAvatar`,
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
    data: ids,
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

/**
 * 部门下拉框
 */
export function selectDept(): AxiosPromise<SelectResponseData> {
  return request({
    url: API.SELECT_DEPT_URL,
    method: 'get',
  })
}

/**
 * 角色下拉框
 */
export function selectRole(): AxiosPromise<SelectResponseData> {
  return request({
    url: API.SELECT_ROLE_URL,
    method: 'get',
  })
}

/**
 * 岗位下拉框
 */
export function selectPost(): Promise<AxiosPromise<SelectResponseData>> {
  return request({
    url: API.SELECT_POST_URL,
    method: 'get',
  })
}

/**
 * 校验用户名是否重复
 *
 *  @param username
 *  @param userId
 */
export function checkUsername(username: string, userId?: number): AxiosPromise<any> {
  return request({
    url: API.CHECK_USERNAME_URL,
    method: 'get',
    params: {
      userId,
      username,
    },
  })
}

/**
 * 用户重置密码
 *
 * @param data
 */
export function userResetPassword(data: UserResetPasswordParam): AxiosPromise<any> {
  return request({
    url: `${API.USER_RESTFUL_URL}/reset`,
    method: 'put',
    data,
  })
}

/**
 * 设置用户角色
 *
 * @param data
 */
export function userSetRole(data: UserSetRoleParam): AxiosPromise<any> {
  return request({
    url: `${API.USER_RESTFUL_URL}/setRole`,
    method: 'put',
    data,
  })
}
