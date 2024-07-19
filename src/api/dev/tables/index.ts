/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'

enum API {
  DB_MATE_CODE_URL = '/dev/v1/dbMate',
}

/**
 * 表信息
 */
export function listTables(): AxiosPromise<any> {
  return request({
    url: `${API.DB_MATE_CODE_URL}/tables`,
    method: 'get',
  })
}

/**
 * 表字段信息
 */
export function listColumns(params: any): AxiosPromise<any> {
  return request({
    url: `${API.DB_MATE_CODE_URL}/columns`,
    method: 'get',
    params,
  })
}
