/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request.ts'
import { AxiosPromise } from 'axios'
import { MsgUserResponseData, MsgUserQuery } from './type.ts'

enum API {
  MSG_USER_RESTFUL_URL = '/msgUser',
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
