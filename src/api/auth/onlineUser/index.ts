/**
 * @author: gaoweixuan
 * @since: 2024-11-07
 */
import request from '@/utils/request.ts'
import { AxiosPromise } from 'axios'
import { OnlineUserResponseData, OnlineUserQuery } from './type.ts'

enum API {
  CLIENT_RESTFUL_URL = '/auth/v1/onlineUser',
}

/**
 * 列表
 *
 * @param params
 */
export function list(params: OnlineUserQuery): AxiosPromise<OnlineUserResponseData> {
  return request({
    url: `${API.CLIENT_RESTFUL_URL}/list`,
    method: 'get',
    params,
  })
}

/**
 * 强退
 *
 * @param userId
 */
export function focusKickOut(userId: number): AxiosPromise<OnlineUserResponseData> {
  return request({
    url: `${API.CLIENT_RESTFUL_URL}/kickOut/${userId}`,
    method: 'put',
  })
}

/**
 * 强退
 *
 * @param token
 */
export function focusKickOutByTokenValue(token: string): AxiosPromise<OnlineUserResponseData> {
  return request({
    url: `${API.CLIENT_RESTFUL_URL}/kickOutByTokenValue/${token}`,
    method: 'put',
  })
}

/**
 * 强制注销
 *
 * @param userId
 */
export function focusLogout(userId: number): AxiosPromise<OnlineUserResponseData> {
  return request({
    url: `${API.CLIENT_RESTFUL_URL}/logout/${userId}`,
    method: 'put',
  })
}

/**
 * 强制注销
 *
 * @param token
 */
export function focusLogoutByTokenValue(token: string): AxiosPromise<OnlineUserResponseData> {
  return request({
    url: `${API.CLIENT_RESTFUL_URL}/logoutByTokenValue/${token}`,
    method: 'put',
  })
}
