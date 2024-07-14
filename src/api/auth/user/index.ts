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
  UserSwitchForm,
  UserResetPasswordForm,
  UserSetRoleForm,
  UserForm,
} from './type'
import { ResponseData, SelectResponseData } from '@/types/types.ts'

enum API {
  USER_RESTFUL_URL = '/auth/v1/user',
  CHECK_USERNAME_URL = '/auth/v1/user/checkUsername',
  SELECT_DEPT_URL = '/sys/v1/common/selectDept',
  SELECT_POST_URL = '/sys/v1/common/selectPost',
  SELECT_ROLE_URL = '/sys/v1/common/selectRole',
  SELECT_USER_LIST_URL = '/sys/v1/common/listUser',
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
export function addUser(data: UserForm): AxiosPromise<ResponseData> {
  return request({
    url: API.USER_RESTFUL_URL,
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
export function editUser(id: number, data: UserForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.USER_RESTFUL_URL}/${id}`,
    method: 'put',
    data: data,
  })
}

/**
 * 编辑头像
 *
 * @param data
 */
export function editAvatar(data: UserRecord): AxiosPromise<ResponseData> {
  return request({
    url: `${API.USER_RESTFUL_URL}/modifyAvatar`,
    method: 'put',
    data: data,
  })
}

/**
 * switch激活
 *
 * @param data
 */
export function open(data: UserSwitchForm): AxiosPromise<ResponseData> {
  return request({
    url: API.USER_RESTFUL_URL + `/open`,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteUser(ids: number[]): AxiosPromise<ResponseData> {
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
export function exportExcel(params: UserQuery): AxiosPromise<any> {
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
export function selectPost(): AxiosPromise<SelectResponseData> {
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
export function userResetPassword(data: UserResetPasswordForm): AxiosPromise<ResponseData> {
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
export function userSetRole(data: UserSetRoleForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.USER_RESTFUL_URL}/setRole`,
    method: 'put',
    data,
  })
}

/**
 * 用户列表
 *
 * @param deptId
 */
export function listUser(deptId?: number): AxiosPromise<any> {
  return request({
    url: `${API.SELECT_USER_LIST_URL}`,
    method: 'get',
    params: {
      deptId,
    },
  })
}
