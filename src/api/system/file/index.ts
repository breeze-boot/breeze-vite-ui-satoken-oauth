/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { FileResponseData, FileQuery, FileRecord } from './type'

enum API {
  FILE_RESTFUL_URL = '/file',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: FileQuery): AxiosPromise<FileResponseData> {
  return request({
    url: API.FILE_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getFile(id: number): AxiosPromise<FileResponseData> {
  return request({
    url: API.FILE_RESTFUL_URL,
    method: 'get',
    params: id,
  })
}

/**
 * 添加
 *
 * @param data 文件实体
 */
export function addFile(data: FileRecord): AxiosPromise<FileResponseData> {
  return request({
    url: API.FILE_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param data 文件实体
 */
export function editFile(data: FileRecord): AxiosPromise<FileResponseData> {
  return request({
    url: API.FILE_RESTFUL_URL,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids ids数组
 */
export function deleteFile(ids: number[]): AxiosPromise<FileResponseData> {
  return request({
    url: API.FILE_RESTFUL_URL,
    method: 'delete',
    params: ids,
  })
}

/**
 * 导出
 *
 * @param params 查询参数
 */
export function exportExcel(params: FileQuery): AxiosPromise<FileResponseData> {
  return request({
    url: API.FILE_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}
