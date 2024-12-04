/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request.ts'
import { AxiosPromise } from 'axios'
import { MsgUserResponseData, MsgUserQuery } from './type.ts'
import { ResponseData } from '@/types/types.ts'

enum API {
  MSG_USER_RESTFUL_URL = '/sys/v1/msgUser',
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
export function deleteMsgUser(ids: number[]): AxiosPromise<ResponseData> {
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
export function exportExcel(params: MsgUserQuery): AxiosPromise<any> {
  return request({
    url: API.MSG_USER_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 读取用户的消息
 *
 * @param msgId
 */
export function readUserMsg(msgId: number): AxiosPromise<ResponseData> {
  return request({
    url: `${API.MSG_USER_RESTFUL_URL}/read/${msgId}`,
    method: 'put',
  })
}

/**
 * 关闭用户的消息
 *
 * @param msgId
 */
export function closeUserMsg(msgId: number): AxiosPromise<ResponseData> {
  return request({
    url: `${API.MSG_USER_RESTFUL_URL}/close/${msgId}`,
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
    url: `${API.MSG_USER_RESTFUL_URL}/listUsersMsg`,
    method: 'get',
    params: {
      username,
    },
  })
}
