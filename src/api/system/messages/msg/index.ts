/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request.ts'
import { AxiosPromise } from 'axios'
import { MsgResponseData, MsgQuery, MsgRecord } from './type.ts'

enum API {
  MSG_RESTFUL_URL = '/msg',
  CHECK_MSG_CODE_URL = '/msg/checkMsgCode',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: MsgQuery): AxiosPromise<MsgResponseData> {
  return request({
    url: API.MSG_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getMsg(id: number): AxiosPromise<MsgResponseData> {
  return request({
    url: `${API.MSG_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addMsg(data: MsgRecord): AxiosPromise<MsgResponseData> {
  return request({
    url: API.MSG_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param data
 */
export function editMsg(data: MsgRecord): AxiosPromise<MsgResponseData> {
  return request({
    url: API.MSG_RESTFUL_URL,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteMsg(ids: number[]): AxiosPromise<MsgResponseData> {
  return request({
    url: API.MSG_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: MsgQuery): AxiosPromise<MsgResponseData> {
  return request({
    url: API.MSG_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 校验消息编码是否重复
 *
 *  @param roleCode
 *  @param roleId
 */
export function checkMsgCode(roleCode: string, roleId?: number): AxiosPromise<any> {
  return request({
    url: API.CHECK_MSG_CODE_URL,
    method: 'get',
    params: {
      roleId: roleId,
      roleCode: roleCode,
    },
  })
}
