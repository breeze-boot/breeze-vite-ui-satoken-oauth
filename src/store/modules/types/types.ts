/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import type { RouteRecordRaw } from 'vue-router'
import type { Tab, UserInfoData, Tabs, Settings, Dicts } from '@/types/types'
import { ColumnCacheData, Theme } from '@/types/types'
import { Client } from '@stomp/stompjs'

/**
 * 用户保存类型
 */
export interface UserState {
  userInfo: UserInfoData
  tenantId: number | null
  accessToken: string
  refreshToken: string
  roleCodes: string[]
  permissions: string[]
}

/**
 * 登录状态保存类型
 */
export interface LoginState {
  phone: string
  phoneCountDown: string
  email: string
  emailCountDown: string
}

/**
 * 菜单保存类型
 */
export interface MenuState {
  initMenu: boolean
  currentMenu: RouteRecordRaw
  menuRoutes: RouteRecordRaw[]
  subMenuRoutes: RouteRecordRaw[]
}

/**
 * 字典保存类型
 */
export interface DictState {
  dict: Dicts
}

/**
 * 系统配置保存类型
 */
export interface SettingState {
  refresh: boolean
  device: string
  theme: Theme
  settings: Settings
}

/**
 * stomp保存类型
 */
export interface MsgState {
  stompClient: Client | undefined
}

/**
 * 选项卡保存类型
 */
export interface TabsState {
  contextMenuLocationX: number
  contextMenuLocationY: number
  contextMenuStatus: boolean
  currentTabName: string
  currentTab: Tab
  tabs: Tabs
  cacheTabs: string[]
}

/**
 * 菜单列字段保存类型
 */
export interface ColumnState {
  columns: ColumnCacheData[]
}
