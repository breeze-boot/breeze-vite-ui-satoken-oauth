/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { CategoryResponseData, CategoryQuery, CategoryRecord, CategoryForm } from './type'
import { ResponseData, SelectResponseData } from '@/types/types.ts'

enum API {
  CATEGORY_RESTFUL_URL = '/bpm/v1/category',
  CHECK_CATEGORY_CODE_URL = '/bpm/v1/category/checkCategoryCode',
  CATEGORY_SELECT_URL = '/bpm/v1/common/selectCategory',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: CategoryQuery): AxiosPromise<CategoryResponseData> {
  return request({
    url: API.CATEGORY_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getCategory(id: number): AxiosPromise<CategoryResponseData> {
  return request({
    url: `${API.CATEGORY_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addCategory(data: CategoryForm): AxiosPromise<ResponseData> {
  return request({
    url: API.CATEGORY_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param id
 * @param data
 */
export function editCategory(id: number, data: CategoryForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.CATEGORY_RESTFUL_URL}/${id}`,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteCategory(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.CATEGORY_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: CategoryRecord): AxiosPromise<any> {
  return request({
    url: API.CATEGORY_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 校验流程分类编码是否重复
 *
 *  @param categoryCode
 *  @param categoryId
 */
export function checkCategoryCode(categoryCode: string, categoryId?: number): AxiosPromise<any> {
  return request({
    url: API.CHECK_CATEGORY_CODE_URL,
    method: 'get',
    params: {
      categoryId,
      categoryCode,
    },
  })
}

/**
 * 流程分类下拉框
 */
export function selectCategory(): AxiosPromise<SelectResponseData> {
  return request({
    url: API.CATEGORY_SELECT_URL,
    method: 'get',
  })
}
