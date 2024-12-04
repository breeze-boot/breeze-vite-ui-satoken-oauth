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
import { ResponseData } from '@/types/types.ts'

enum API {
  USER_RESTFUL_URL = '/auth/v1/user',
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
 * 同步用户
 */
export function syncUser(): AxiosPromise<ResponseData> {
  return request({
    url: `${API.USER_RESTFUL_URL}/syncFlowableUser`,
    method: 'get',
  })
}

/**
 * 导出
 *
 * @param data
 */
export function exportExcel(data: UserQuery): AxiosPromise<any> {
  return request({
    url: `${API.USER_RESTFUL_URL}/export`,
    method: 'post',
    data: data,
    // 指定响应类型为二进制流
    responseType: 'blob',
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
    url: `${API.USER_RESTFUL_URL}/checkUsername`,
    method: 'get',
    params: {
      userId,
      username,
    },
  })
}

/**
 * 校验用户账户是否重复
 *
 *  @param userCode
 *  @param userId
 */
export function checkUserCode(userCode: string, userId?: number): AxiosPromise<any> {
  return request({
    url: `${API.USER_RESTFUL_URL}/checkUserCode`,
    method: 'get',
    params: {
      userId,
      userCode,
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
export function listDeptUser(deptId?: number): AxiosPromise<any> {
  return request({
    url: `${API.USER_RESTFUL_URL}/listDeptUser`,
    method: 'get',
    params: {
      deptId,
    },
  })
}
