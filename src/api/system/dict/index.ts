/**
 * @author: gaoweixuan
 * @since: 2024-03-01
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { DictForm, DictQuery, DictResponseData, DictSwitchForm } from '@/api/system/dict/type.ts'
import { ResponseData } from '@/types/types.ts'

enum API {
  DICT_RESTFUL_URL = '/sys/v1/dict',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: DictQuery): AxiosPromise<DictResponseData> {
  return request({
    url: `${API.DICT_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * switch激活
 *
 * @param data
 */
export function open(data: DictSwitchForm): AxiosPromise<DictResponseData> {
  return request({
    url: API.DICT_RESTFUL_URL + `/open`,
    method: 'put',
    data,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getDict(id: number): AxiosPromise<DictResponseData> {
  return request({
    url: `${API.DICT_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addDict(data: DictForm): AxiosPromise<ResponseData> {
  return request({
    url: API.DICT_RESTFUL_URL,
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
export function editDict(id: number, data: DictForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.DICT_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteDict(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.DICT_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: DictQuery): AxiosPromise<any> {
  return request({
    url: API.DICT_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 查询字典信息
 *
 * @param dictCode
 */
export function listDict(dictCode: string): AxiosPromise<DictResponseData> {
  return request({
    url: API.DICT_RESTFUL_URL + `/v2/listDict/${dictCode}`,
    method: 'get',
  })
}
