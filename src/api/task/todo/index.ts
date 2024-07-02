/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { TodoResponseData, TodoQuery, TodoRecord } from './type'

enum API {
  TODO_RESTFUL_URL = '/flow/v1/task',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: TodoQuery): AxiosPromise<TodoResponseData> {
  return request({
    url: API.TODO_RESTFUL_URL + '/listTodoTask',
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getTodo(id: number): AxiosPromise<TodoResponseData> {
  return request({
    url: `${API.TODO_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: TodoRecord): AxiosPromise<any> {
  return request({
    url: API.TODO_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}
