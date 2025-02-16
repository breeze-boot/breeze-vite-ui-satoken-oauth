/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { UserResponseData, UserQuery } from './type'

enum API {
  BPM_USER_RESTFUL_URL = '/bpm/v1/user',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: UserQuery): AxiosPromise<UserResponseData> {
  return request({
    url: `${API.BPM_USER_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}
