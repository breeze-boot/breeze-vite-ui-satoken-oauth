/**
 * @author: gaoweixuan
 * @since: 2024-11-07
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 在线用户列表类型声明
 */
export interface OnlineUserRecord {
  userId: number
  username?: string
  userCode?: string
  sessionCreateTime?: string
  displayName?: string
  loginDevice?: LoginDevice[]
  loginDeviceCount?: number
}

/**
 * 在线用户登录设备列表类型声明
 */
export interface LoginDevice {
  device: string
  value: string
}

/**
 * 客户端列表数组类型声明
 */
export type OnlineUserRecords = OnlineUserRecord[]

/**
 * 客户端列表接口响应类型声明
 */
export interface OnlineUserResponseData extends ResponseData {
  data: {
    records: OnlineUserRecords
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 客户端列表查询类型声明
 */
export interface OnlineUserQuery extends PageQuery {}
