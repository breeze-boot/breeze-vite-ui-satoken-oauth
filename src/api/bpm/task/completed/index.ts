/**
 * @author: gaoweixuan
 * @since: 2024-08-11
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { CompletedResponseData, CompletedQuery } from './type'

enum API {
  COMPLETED_RESTFUL_URL = '/bpm/v1/task',
}

/**
 * 列表
 *
 * @param data
 */
export function list(data: CompletedQuery): AxiosPromise<CompletedResponseData> {
  return request({
    url: `${API.COMPLETED_RESTFUL_URL}/listCompletedTask`,
    method: 'post',
    data,
  })
}
