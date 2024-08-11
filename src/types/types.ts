/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 *
 * =====================
 * 此处用来声明公共的类型
 * =====================
 */
import { RouteRecordRaw } from 'vue-router'

/**
 * 分页查询参数
 */
export interface PageQuery {
  current: number
  size: number
}

/**
 * 下拉框公共参数
 */
export interface SelectData {
  value: number | string | boolean
  label: string
  children?: SelectData[]
}

/**
 * 下拉框响应类型声明
 */
export interface SelectResponseData extends ResponseData {
  data: {
    value: number | string
    label: string
    children?: SelectData
  }
}

/**
 * 公共返回参数
 */
export interface ResponseData {
  code: number | string
  message: string
  timestamp: bigint
  data:
    | {
        records: object
        total: number
        size: number
        current: number
        pages: number
      }
    | boolean
    | object
}

/**
 * 权限参数
 */
export interface AuthoritiesData {
  authority: string
}

/**
 * 权限数组参数
 */
export type AuthoritiesDatas = AuthoritiesData[]

/**
 * 登录用户参数
 */
export interface UserInfoData {
  password: null
  username: string
  avtar: string
  tenantId: string
  permissions: object
  authorities: AuthoritiesDatas
  accountNonExpired: boolean
  accountNonLocked: boolean
  credentialsNonExpired: boolean
  enabled: boolean
  id: number
  deptId: number
  deptName: string
  userCode: string
  amountName: string
  avatar: string
  phone: string
  sex: number
  idCard: string
  amountType: number
  isLock: number
  openId: string
  email: string
  userRoleCodes: string[]
  userRoleIds: number[]
  excludeColumn: string[]
}

/**
 * 权限数据类型
 */
export interface PermissionData {
  id: string
  parentId: string
  weight: number
  name: string
  path: string
  component: string
  keepAlive: number
  hidden: number
  icon: string
  permission: string
  href: number
  platformId: string
  sort: number
  title: string
  platformName: null
  type: number
  children: PermissionDatas | RouteRecordRaw[]
}

/**
 * 权限数据数组类型
 */
export type PermissionDatas = PermissionData[]

/**
 * 登录类型
 */
export enum GrantType {
  PASSWORD = 'password',
  REFRESH_TOKEN = 'refresh_token',
  SMS = 'sms',
  EMAIL = 'email',
}

/**
 * 盐
 */
export const SALES: string = '1234567890123456'

/**
 * 缓存值名称
 */
export enum StorageName {
  AccessToken = 'ACCESS_TOKEN',
  RefreshToken = 'REFRESH_TOKEN',
  RoleCodes = 'ROLE_CODES',
  Permissions = 'PERMISSIONS',
  UserInfo = 'USER_INFO',
  Columns = 'COLUMNS',
  XTenantId = 'X-TENANT-ID',
  Authorization = 'Authorization',
  mixMenuRoutes = 'MIX_MENU_ROUTES',
  menuRoutes = 'MENU_ROUTES',
}

/**
 * pinia 字典保存参数
 *
 * [
 *   {
 *     code  : dictName,
 *     value :
 *        {
 *            label?: string
 *            value?: string
 *            type?: string
 *        },
 *   }
 * ]
 */
export interface Dict {
  [idx: number]: DictItem
}

export interface Dicts {
  [idx: string]: Dict
}

/**
 * 字典项保存参数
 */
export interface DictItem {
  value?: number
  label?: string
  type?: string
}

/**
 * 设置类型
 */
export interface Settings {
  title: string
  showAvatar: boolean
  isCollapse: boolean
  logoHidden: boolean
  logoUrl: any
  language: string
}

/**
 * 设置主题类型
 */
export interface Theme {
  menuLayout: MenuLayout
  watermark: boolean
  watermarkContent: string[]
  themeModel: string
  lightFont: object
  darkFont: object
  themeColor: string
  size: string
}

export type MenuLayout = 'left' | 'top' | 'mix' | string

/**
 * Tab类型
 */
export interface Tab {
  title: string
  name: string
  path: string
  fullPath: string
  query?: object
  params?: object
  keepAlive: boolean
  hidden: boolean
}

export interface Button {
  event: string
  key: string
  name: string
  procInstId: string
  taskId: string
  username: string
}

/**
 * Tab数组类型
 */
export type Tabs = Tab[]

export interface Option {
  key: string | number
  label: string
  initial: string
}

/**
 * 菜单列缓存类型声明
 */
export interface ColumnCacheData {
  menu?: string
  columns: string[]
  visible?: boolean
}
