/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import type { DeptResponseData, DeptQuery, DeptForm } from './type'
import JSONBigInt from 'json-bigint'
import { SelectResponseData } from '@/types/types.ts'

enum API {
  DEPT_RESTFUL_URL = '/auth/v1/dept',
}

/**
 * 列表
 *
 * @param params
 */
export function list(params: DeptQuery): AxiosPromise<DeptResponseData> {
  return request({
    url: API.DEPT_RESTFUL_URL,
    method: 'get',
    params: {
      ...params,
      platformId: JSONBigInt.parse('1111111111111111111'),
    },
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getDept(id: number): AxiosPromise<DeptResponseData> {
  return request({
    url: `${API.DEPT_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addDept(data: DeptForm): AxiosPromise<DeptResponseData> {
  return request({
    url: API.DEPT_RESTFUL_URL,
    method: 'post',
    data,
  })
}

/**
 * 编辑
 *
 * @param id
 * @param data
 */
export function editDept(id: number, data: DeptForm): AxiosPromise<DeptResponseData> {
  return request({
    url: `${API.DEPT_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param id
 */
export function deleteDept(id: number): AxiosPromise<DeptResponseData> {
  return request({
    url: API.DEPT_RESTFUL_URL,
    method: 'delete',
    data: id,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: DeptQuery): AxiosPromise<DeptResponseData> {
  return request({
    url: API.DEPT_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 部门下拉框
 */
export function selectDept(id?: number): AxiosPromise<SelectResponseData> {
  return request({
    url: `${API.DEPT_RESTFUL_URL}/selectDept`,
    method: 'get',
    params: {
      id,
    },
  })
}

/**
 * 校验部门编码是否重复
 *
 * @param deptCode
 * @param deptId
 */
export function checkDeptCode(deptCode: string, deptId: number): Promise<AxiosPromise<SelectResponseData>> {
  return request({
    url: `${API.DEPT_RESTFUL_URL}/checkDeptCode`,
    method: 'get',
    params: {
      deptId: deptId || '',
      deptCode: deptCode,
    },
  })
}
