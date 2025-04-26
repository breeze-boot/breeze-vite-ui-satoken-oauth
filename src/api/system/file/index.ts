/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { FileResponseData, FileQuery, FileRecord, FileUploadResponseData } from './type'
import { FileForm, ResponseData } from '@/types/types.ts'

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
 * @param fileForm
 */
export function uploadMinioS3(file: File, fileForm: FileForm): AxiosPromise<FileUploadResponseData> {
  const formData: FormData = new FormData()
  formData.append('file', file)

  return request({
    url: `${API.FILE_RESTFUL_URL}/${fileForm.bizType}/uploadMinioS3`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 下载系统文件
 *
 * @param fileId
 */
export function download(fileId: number): AxiosPromise<any> {
  return request({
    url: `${API.FILE_RESTFUL_URL}/download`,
    method: 'get',
    params: {
      fileId,
    },
    // 指定响应类型为二进制流
    responseType: 'blob',
  })
}
