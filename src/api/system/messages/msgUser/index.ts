/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request.ts'
import { AxiosPromise } from 'axios'
import { MsgUserResponseData, MsgUserQuery } from './type.ts'

enum API {
  MSG_USER_RESTFUL_URL = '/msgUser',
  LIST_USERS_MSG_URL = '/msgUser/listUsersMsg',
  CLOSE_USERS_MSG_URL = '/msgUser/close',
  READ_USERS_MSG_URL = '/msgUser/read',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: MsgUserQuery): AxiosPromise<MsgUserResponseData> {
  return request({
    url: API.MSG_USER_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteMsgUser(ids: number[]): AxiosPromise<MsgUserResponseData> {
  return request({
    url: API.MSG_USER_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: MsgUserQuery): AxiosPromise<MsgUserResponseData> {
  return request({
    url: API.MSG_USER_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 获取用户的消息
 *
 * @param username
 */
export function closeMsg(username: string): AxiosPromise<MsgUserResponseData> {
  return request({
    url: API.LIST_USERS_MSG_URL,
    method: 'get',
    params: {
      username,
    },
  })
}

/**
 * 读取用户的消息
 *
 * @param msgId
 */
export function readUserMsg(msgId: number): AxiosPromise<MsgUserResponseData> {
  return request({
    url: `${API.READ_USERS_MSG_URL}/${msgId}`,
    method: 'put',
  })
}

/**
 * 关闭用户的消息
 *
 * @param msgId
 */
export function closeUserMsg(msgId: number): AxiosPromise<MsgUserResponseData> {
  return request({
    url: `${API.CLOSE_USERS_MSG_URL}/${msgId}`,
    method: 'put',
  })
}

/**
 * 获取用户的消息
 *
 * @param username
 */
export function listUsersMsg(username: string): AxiosPromise<MsgUserResponseData> {
  return request({
    url: API.LIST_USERS_MSG_URL,
    method: 'get',
    params: {
      username,
    },
  })
}
