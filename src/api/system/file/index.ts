/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { FileResponseData, FileQuery, FileRecord, FileUploadResponseData, FileParam } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  FILE_RESTFUL_URL = '/sys/v1/file',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: FileQuery): AxiosPromise<FileResponseData> {
  return request({
    url: `${API.FILE_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 编辑
 *
 * @param id
 * @param data 文件
 */
export function editFile(id: number, data: FileRecord): AxiosPromise<ResponseData> {
  return request({
    url: `${API.FILE_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids ids数组
 */
export function deleteFile(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.FILE_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params 查询参数
 */
export function exportExcel(params: FileQuery): AxiosPromise<any> {
  return request({
    url: API.FILE_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 上传文件
 *
 * @param file
 * @param fileParam
 */
export function uploadMinioS3(file: File, fileParam: FileParam): AxiosPromise<FileUploadResponseData> {
  const formData: FormData = new FormData()
  formData.append('file', file)
  formData.append('bizType', fileParam.bizType)
  fileParam.bizId ? formData.append('bizId', fileParam.bizId as string) : () => {}

  return request({
    url: `${API.FILE_RESTFUL_URL}/uploadMinioS3`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
