/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import type { RouteRecordRaw } from 'vue-router'
import type { AuthorizationData, StoreDict, Tab, UserInfoData, Tabs, Settings } from '@/types/types'
import { Theme } from '@/types/types'

/**
 * 用户保存类型
 */
export interface UserState {
  authorization: AuthorizationData | object
  accessToken: string | ''
  userInfo: UserInfoData
  buttons: string[]
  roleCodes: string[]
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
  dict: StoreDict[]
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
 * 选项卡保存类型
 */
export interface TabsState {
  contextMenuLocationX: number
  contextMenuLocationY: number
  contextMenuStatus: boolean
  currentTabName: string
  currentTab: Tab
  tabs: Tabs
}
