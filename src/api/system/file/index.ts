/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { FileResponseData, FileQuery, FileRecord, FileUploadResponseData, FileParam } from './type'

enum API {
  FILE_RESTFUL_URL = '/file',
  UPLOAD_FILE_URL = '/common/uploadMinioS3',
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
 * 编辑
 *
 * @param data 文件
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
    data: ids,
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
