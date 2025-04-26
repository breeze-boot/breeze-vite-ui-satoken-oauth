/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 文件列表类型声明
 */
export interface FileRecord {
  id?: number
  name: string
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
 * 文件列表数组类型声明
 */
export type FileRecords = FileRecord[]

/**
 * 文件列表接口响应类型声明
 */
export interface FileResponseData extends ResponseData {
  data: {
    records: FileRecords | FileRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 文件列表查询类型声明
 */
export interface FileQuery extends PageQuery {
  name?: string
}

/**
 * 文件上传响应类型声明
 */
export interface FileUploadResponseData extends ResponseData {
  data: {
    name: string
    url: string
  }
}
