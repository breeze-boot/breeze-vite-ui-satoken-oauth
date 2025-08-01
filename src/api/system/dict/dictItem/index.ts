/**
 * @author: gaoweixuan
 * @since: 2024-03-01
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { DictItemForm, DictItemQuery, DictItemResponseData } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  DICT_ITEM_RESTFUL_URL = '/sys/v1/dictItem',
}

/**
 * 列表
 *
 * @param data
 */
export function list(data: DictItemQuery): AxiosPromise<DictItemResponseData> {
  return request({
    url: `${API.DICT_ITEM_RESTFUL_URL}/list`,
    method: 'post',
    data,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getDictItem(id: number): AxiosPromise<DictItemResponseData> {
  return request({
    url: `${API.DICT_ITEM_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addDictItem(data: DictItemForm): AxiosPromise<ResponseData> {
  return request({
    url: API.DICT_ITEM_RESTFUL_URL,
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
export function editDictItem(id: number, data: DictItemForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.DICT_ITEM_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteDictItem(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.DICT_ITEM_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: DictItemQuery): AxiosPromise<any> {
  return request({
    url: API.DICT_ITEM_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}
