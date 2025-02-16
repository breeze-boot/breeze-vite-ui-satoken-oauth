/**
 * @author: gaoweixuan
 * @since: 2024-08-11
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { ApplyResponseData, ApplyQuery } from './type'

enum API {
  USER_APPLY_RESTFUL_URL = '/bpm/v1/task',
}

/**
 * 列表
 *
 * @param data
 */
export function list(data: ApplyQuery): AxiosPromise<ApplyResponseData> {
  return request({
    url: `${API.USER_APPLY_RESTFUL_URL}/listApplyUserTask`,
    method: 'post',
    data,
  })
}
