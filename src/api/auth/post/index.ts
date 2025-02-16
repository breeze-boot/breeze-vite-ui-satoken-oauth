/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { PostResponseData, PostQuery, PostForm } from './type'
import { ResponseData, SelectResponseData } from '@/types/types.ts'

enum API {
  POST_RESTFUL_URL = '/auth/v1/post',
}

/**
 * 列表
 *
 * @param data
 */
export function page(data: PostQuery): AxiosPromise<PostResponseData> {
  return request({
    url: `${API.POST_RESTFUL_URL}/page`,
    method: 'post',
    data,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getPost(id: number): AxiosPromise<PostResponseData> {
  return request({
    url: `${API.POST_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addPost(data: PostForm): AxiosPromise<ResponseData> {
  return request({
    url: API.POST_RESTFUL_URL,
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
export function editPost(id: number, data: PostForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.POST_RESTFUL_URL}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deletePost(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.POST_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: PostQuery): AxiosPromise<any> {
  return request({
    url: API.POST_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 校验权限编码是否重复
 *
 *  @param postCode
 *  @param postId
 */
export function checkPostCode(postCode: string, postId?: number): AxiosPromise<any> {
  return request({
    url: `${API.POST_RESTFUL_URL}/checkPostCode`,
    method: 'get',
    params: {
      postId,
      postCode,
    },
  })
}

/**
 * 岗位下拉框
 */
export function selectPost(): AxiosPromise<SelectResponseData> {
  return request({
    url: `${API.POST_RESTFUL_URL}/selectPost`,
    method: 'get',
  })
}
