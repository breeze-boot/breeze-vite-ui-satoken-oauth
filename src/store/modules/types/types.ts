/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import type { RouteRecordRaw } from 'vue-router'
import type { Tab, UserInfoData, Tabs, Settings, Dicts } from '@/types/types'
import { Theme } from '@/types/types'
import Stomp from 'stompjs'

/**
 * 用户保存类型
 */
export interface UserState {
  userInfo: UserInfoData
  refreshToken: string
  accessToken: string
  roleCodes: string[]
  permissions: string[]
  excludeColumn: string[]
}

/**
 * 菜单保存类型
 */
export interface MenuState {
  initMenu: boolean
  menuRoutes: RouteRecordRaw[]
  mixMenuRoutes: RouteRecordRaw[]
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
  theme: Theme
  settings: Settings
}

/**
 * stomp保存类型
 */
export interface MsgState {
  stompClient: any
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
