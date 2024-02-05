/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { MsgTemplateQuery, MsgTemplateResponseData } from './type'

enum API {
  MSG_TEMPLATE_RESENTFUL_URL = '/admin/msgTemplate',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: MsgTemplateQuery): AxiosPromise<MsgTemplateResponseData> {
  return request({
    url: API.MSG_TEMPLATE_RESENTFUL_URL,
    method: 'get',
    params: params,
  })
}
