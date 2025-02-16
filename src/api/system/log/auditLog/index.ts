/**
 * @author: gaoweixuan
 * @since: 2025-02-15
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { AuditLogResponseData, AuditLogQuery } from './type'
import { ResponseData } from '@/types/types.ts'

enum API {
  AUDIT_LOG_RESTFUL_URL = '/sys/v1/auditLog',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: AuditLogQuery): AxiosPromise<AuditLogResponseData> {
  return request({
    url: `${API.AUDIT_LOG_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteLog(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.AUDIT_LOG_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}
