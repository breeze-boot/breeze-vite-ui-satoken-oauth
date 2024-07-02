/**
 * @author: gaoweixuan
 * @since: 2024-03-06
 */
import request from '@/utils/request.ts'
import { AxiosPromise } from 'axios'

enum API {
  COMMON_DOWNlOAD = '/sys/v1/common/download',
}

/**
 * 下载系统文件
 *
 * @param fileId
 */
export function download(fileId: number): AxiosPromise<any> {
  return request({
    url: API.COMMON_DOWNlOAD,
    method: 'get',
    params: {
      fileId,
    },
    // 指定响应类型为二进制流
    responseType: 'blob',
  })
}
