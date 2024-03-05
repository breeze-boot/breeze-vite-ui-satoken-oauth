/**
 * @author: gaoweixuan
 * @since: 2024-03-01
 */
import { UploadAjaxError } from 'element-plus/es/components/upload/src/ajax'

export interface UploadProgressEvent extends ProgressEvent {
  percent: number
}

export interface UploadRawFile extends File {
  uid: number
}

export interface UploadProgressEvent extends ProgressEvent {
  percent: number
}

export interface UploadRawFile extends File {
  uid: number
}
export type UploadUserFile = Omit<UploadFile, 'status' | 'uid'> & Partial<Pick<UploadFile, 'status' | 'uid'>>
export interface UploadRequestOptions {
  action: string
  method: string
  data: Record<string, string | Blob | [string | Blob, string]>
  filename: string
  file: File
  headers: Headers | Record<string, string | number | null | undefined>
  onError: (evt: UploadAjaxError) => void
  onProgress: (evt: UploadProgressEvent) => void
  onSuccess: (response: any) => void
  withCredentials: boolean
}

export type UploadStatus = 'ready' | 'uploading' | 'success' | 'fail'

export interface UploadFile {
  name: string
  percentage?: number
  status: UploadStatus
  size?: number
  response?: unknown
  uid: number
  url?: string
  raw?: UploadRawFile
}
