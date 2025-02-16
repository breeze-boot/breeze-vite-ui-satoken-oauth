/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { TodoResponseData, TodoQuery, TodoRecord, FlowApprovalForm } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  TODO_RESTFUL_URL = '/bpm/v1/task',
}

/**
 * 列表
 *
 * @param data
 */
export function list(data: TodoQuery): AxiosPromise<TodoResponseData> {
  return request({
    url: `${API.TODO_RESTFUL_URL}/listUserTodoTask`,
    method: 'post',
    data,
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

/**
 * 获取审批记录信息
 *
 * @param procDefKey
 * @param businessKey
 */
export function listFlowApproveInfo(procDefKey: string, businessKey: string): AxiosPromise<ResponseData> {
  return request({
    url: API.TODO_RESTFUL_URL + `/listFlowApproveInfo`,
    method: 'get',
    params: {
      procDefKey,
      businessKey,
    },
  })
}

/**
 * 获取任务详情
 *
 * @param taskId
 */
export function getTaskInfo(taskId: string) {
  return request({
    url: API.TODO_RESTFUL_URL + `/getTaskInfo`,
    method: 'get',
    params: { taskId },
  })
}

/**
 * 获取流程的按钮信息
 *
 * @param procDefKey
 * @param businessKey
 * @param procInstId
 */
export function getFlowButtonInfo(
  procDefKey: string,
  businessKey: string,
  procInstId: string,
): AxiosPromise<ResponseData> {
  return request({
    url: API.TODO_RESTFUL_URL + `/getFlowButtonInfo`,
    method: 'get',
    params: {
      procDefKey,
      businessKey,
      procInstId,
    },
  })
}

/**
 * 审批通过
 *
 * @param data
 */
export function agree(data: FlowApprovalForm): AxiosPromise<ResponseData> {
  return request({
    url: API.TODO_RESTFUL_URL + `/agree`,
    method: 'post',
    data,
  })
}
/**
 * 审批废止
 *
 * @param data
 */
export function abolition(data: FlowApprovalForm): AxiosPromise<ResponseData> {
  return request({
    url: API.TODO_RESTFUL_URL + `/abolition`,
    method: 'post',
    data,
  })
}
/**
 * 审批通过
 *
 * @param taskId
 */
export function resolveTask(taskId: string): AxiosPromise<ResponseData> {
  return request({
    url: API.TODO_RESTFUL_URL + `/resolveTask/${taskId}`,
    method: 'post',
  })
}

/**
 * 审批拒绝
 *
 * @param data
 */
export function reject(data: FlowApprovalForm): AxiosPromise<ResponseData> {
  return request({
    url: API.TODO_RESTFUL_URL + `/reject`,
    method: 'post',
    data,
  })
}

/**
 * 签收
 *
 * @param taskId
 */
export function claim(taskId: string): AxiosPromise<ResponseData> {
  return request({
    url: API.TODO_RESTFUL_URL + `/claim/${taskId}`,
    method: 'post',
  })
}
/**
 * 签收
 *
 * @param taskId
 */
export function unClaim(taskId: string): AxiosPromise<ResponseData> {
  return request({
    url: API.TODO_RESTFUL_URL + `/unClaim/${taskId}`,
    method: 'post',
  })
}

/**
 * 加签
 *
 * @param taskId
 * @param username
 */
export function delegateTask(taskId: string, username: string): AxiosPromise<ResponseData> {
  return request({
    url: API.TODO_RESTFUL_URL + `/delegateTask/${taskId}/${username}`,
    method: 'post',
  })
}

/**
 * 转签
 *
 * @param taskId
 * @param username
 */
export function transferTask(taskId: string, username: string): AxiosPromise<ResponseData> {
  return request({
    url: API.TODO_RESTFUL_URL + `/transferTask/${taskId}/${username}`,
    method: 'post',
  })
}
