/**
 * @author: gaoweixuan
 * @since: 2024-03-01
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { DictItemQuery, DictItemRecord, DictItemResponseData } from '@/api/system/dictItem/type.ts'

enum API {
  DICT_ITEM_RESTFUL_URL = '/dictItem',
}

/**
 * 列表
 *
 * @param params
 */
export function list(params: DictItemQuery): AxiosPromise<DictItemResponseData> {
  return request({
    url: API.DICT_ITEM_RESTFUL_URL,
    method: 'get',
    params: params,
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
export function addDictItem(data: DictItemRecord): AxiosPromise<DictItemResponseData> {
  return request({
    url: API.DICT_ITEM_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param data
 */
export function editDictItem(data: DictItemRecord): AxiosPromise<DictItemResponseData> {
  return request({
    url: API.DICT_ITEM_RESTFUL_URL,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteDictItem(ids: number[]): AxiosPromise<DictItemResponseData> {
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
export function exportExcel(params: DictItemQuery): AxiosPromise<DictItemResponseData> {
  return request({
    url: API.DICT_ITEM_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}
