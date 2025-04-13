/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'

enum API {
  CHAT_RESTFUL_URL = '/ai/v1',
}

/**
 * 创建对话
 *
 * @param userId
 */
export function createChat(userId: number): AxiosPromise<any> {
  return request({
    url: `${API.CHAT_RESTFUL_URL}/create`,
    method: 'get',
    params: { userId },
  })
}

/**
 * 历史聊天记录列表
 *
 * @param userId
 * @param current
 * @param size
 */
export function historyChat(userId: number, current: number, size: number): AxiosPromise<any> {
  return request({
    url: `${API.CHAT_RESTFUL_URL}/history`,
    method: 'get',
    params: { userId, current, size },
  })
}

/**
 * 历史聊天记录详情
 *
 * @param id
 */
export function historyChatDetail(id: string): AxiosPromise<any> {
  return request({
    url: `${API.CHAT_RESTFUL_URL}/historyDetail`,
    method: 'get',
    params: { id },
  })
}
