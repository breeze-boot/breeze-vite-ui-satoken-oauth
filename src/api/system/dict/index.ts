/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import type { DictResponseData } from './type'

enum API {
  DICT_RESTFUL_URL = '/dict/',
}

export function listDict(dictCode: string): AxiosPromise<DictResponseData> {
  return request({
    url: API.DICT_RESTFUL_URL + `/v2/listDict/${dictCode}`,
    method: 'get',
  })
}
