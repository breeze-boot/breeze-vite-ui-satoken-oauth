/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { GroupResponseData, GroupQuery } from './type'

enum API {
  BPM_GROUP_RESTFUL_URL = '/bpm/v1/group',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: GroupQuery): AxiosPromise<GroupResponseData> {
  return request({
    url: `${API.BPM_GROUP_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}
