/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request.ts'
import { AxiosPromise } from 'axios'
import { ClientResponseData, ClientQuery, ClientForm } from './type.ts'

enum API {
  CLIENT_RESTFUL_URL = '/auth/v1/client',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: ClientQuery): AxiosPromise<ClientResponseData> {
  return request({
    url: API.CLIENT_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getClient(id: number): AxiosPromise<ClientResponseData> {
  return request({
    url: `${API.CLIENT_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addClient(data: ClientForm): AxiosPromise<ClientResponseData> {
  return request({
    url: API.CLIENT_RESTFUL_URL,
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
export function editClient(id: number, data: ClientForm): AxiosPromise<ClientResponseData> {
  return request({
    url: `${API.CLIENT_RESTFUL_URL}/${id}`,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteClient(ids: number[]): AxiosPromise<ClientResponseData> {
  return request({
    url: API.CLIENT_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: ClientQuery): AxiosPromise<ClientResponseData> {
  return request({
    url: API.CLIENT_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}
