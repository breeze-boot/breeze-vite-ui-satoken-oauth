/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 文件列表实体类型
 */
export interface File {
  id?: number | undefined
  title: string
  fileName: string
  fileFormat: string
  contentType: string
  bucket: string
  objectName: string
  path: string
  bizId: string
  bizType: string
  storeType: string
  createTime?: string
  updateTime?: string
}

/**
 * 文件列表数组类型
 */
export type FileRecords = File[]

/**
 * 文件响应返回类型
 */
export interface FileResponseData extends ResponseData {
  data: {
    records: FileRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 文件列表查询类型
 */
export interface FileQuery extends PageQuery {
  keywords?: string
  status?: number
  fileName?: string
  startTime?: string
  endTime?: string
}
