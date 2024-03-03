/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import type { DeptResponseData, DeptQuery, DeptRecord } from './type'
import JSONBigInt from 'json-bigint'
import { SelectResponseData } from '@/types/types.ts'

enum API {
  MENU_RESTFUL_URL = '/dept',
  CHECK_DEPT_CODE_URL = '/dept/checkDeptCode',
  SELECT_DEPT_URL = '/common/selectDept',
}

/**
 * 列表
 *
 * @param params
 */
export function list(params: DeptQuery): AxiosPromise<DeptResponseData> {
  return request({
    url: API.MENU_RESTFUL_URL,
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
    url: `${API.MENU_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addDept(data: DeptRecord): AxiosPromise<DeptResponseData> {
  return request({
    url: API.MENU_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param data
 */
export function editDept(data: DeptRecord): AxiosPromise<DeptResponseData> {
  return request({
    url: API.MENU_RESTFUL_URL,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param id
 */
export function deleteDept(id: number): AxiosPromise<DeptResponseData> {
  return request({
    url: API.MENU_RESTFUL_URL,
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
    url: API.MENU_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 部门下拉框
 */
export function selectDept(id: number): AxiosPromise<SelectResponseData> {
  return request({
    url: API.SELECT_DEPT_URL,
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
    url: API.CHECK_DEPT_CODE_URL,
    method: 'get',
    params: {
      deptId: deptId || '',
      deptCode: deptCode,
    },
  })
}
