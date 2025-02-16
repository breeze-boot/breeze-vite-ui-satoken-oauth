/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request.ts'
import { AxiosPromise } from 'axios'
import { MsgResponseData, MsgQuery, MsgRecord } from './type.ts'
import { ResponseData } from '@/types/types.ts'

enum API {
  MSG_RESTFUL_URL = '/sys/v1/msg',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: MsgQuery): AxiosPromise<MsgResponseData> {
  return request({
    url: `${API.MSG_RESTFUL_URL}/page`,
    method: 'post',
    data,
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
export function addMsg(data: MsgRecord): AxiosPromise<ResponseData> {
  return request({
    url: API.MSG_RESTFUL_URL,
    method: 'post',
    data,
  })
}

/**
 * 编辑
 *
 * @param id
 * @param data
 */
export function editMsg(id: number, data: MsgRecord): AxiosPromise<ResponseData> {
  return request({
    url: `${API.MSG_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteMsg(ids: number[]): AxiosPromise<ResponseData> {
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
export function exportExcel(params: MsgQuery): AxiosPromise<any> {
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
    url: `${API.MSG_RESTFUL_URL}/checkMsgCode`,
    method: 'get',
    params: {
      roleId: roleId,
      roleCode: roleCode,
    },
  })
}
