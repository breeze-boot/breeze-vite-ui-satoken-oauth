/**
 * @author: gaoweixuan
 * @since: 2023-10-02
 */

import { Arrayable } from 'element-plus/es/utils'
import { SelectData } from '@/types/types.ts'
import { FormItemRule } from 'element-plus/es/components/form'

/**
 * 按钮类型
 */
export interface Btn {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'text' | ''
  icon?: string
  loading?: boolean
  label?: string
  disabled?: (event: string, row: any) => boolean
  hidden?: (event: string, row: any) => boolean
  slot?: string
  slotName?: string
  permission?: string[]
  link?: boolean
  event: Event
  eventHandle?: (row: any, $index?: number) => void
}

/**
 * 事件类型
 */
export type Event = 'exportAll' | 'export' | 'delete' | 'add' | string
export type SelectEvent = 'multi' | 'single'

/**
 * 表格类型
 */
export interface TableInfo {
  dict?: string[]
  fieldList?: Field[]
  tbHeaderBtn?: Btn[]
  handleBtn?: HandleBtn
}

/**
 * 表格排序
 */
export interface ColumnSort {
  prop: string
  order: 'ascending' | 'descending'
}

/**
 * 操作类型
 */
export interface HandleBtn {
  minWidth?: number | 210
  label: string | '操作'
  fixed?: 'right' | 'left'
  align?: string
  width?: string | number
  link?: boolean
  btList?: Btn[]
}

/**
 * 表格字段类型
 */
export interface Field {
  align?: 'center' | 'right' | 'left'
  children?: Field[]
  dict?: string
  disabled?: boolean
  visible?: boolean
  fixed?: boolean
  formOptions?: FormOptions
  hidden?: boolean
  input?: InputOption
  key?: number
  label?: string
  linkInfo?: LinkInfo | LinkInfo2
  minWidth?: string
  prop: string
  showOverflowTooltip?: boolean
  sortable?: boolean | 'custom'
  switch?: SwitchOption
  tag?: TagOptions
  textarea?: TextareaOption
  type?:
    | string
    | 'tag'
    | 'slot'
    | 'expand'
    | 'customRowLink'
    | 'rowLink'
    | 'image'
    | 'switch'
    | 'upload'
    | 'file'
    | 'select'
    | 'radio'
    | 'input'
    | 'textarea'
  upload?: UploadOption
  width?: number | string
  sliderWidth?: number
}

export interface FormOptions {
  handleChange?: (row: any) => void
  handleBlur?: (row: any) => void
  placeholder?: string
  disabled?: boolean
  isDisabled?: (field: Field, row: any) => boolean
  rules?: Arrayable<FormItemRule>
  options?: SelectData[]
  optionKey?: string // 后台行内返回的选项的字段名
}

/**
 * tag类型
 */
export interface TagOptions {
  [idx: number | string]: TagOption
}

/**
 * 文件上传类型
 */
export interface UploadOption {
  api?: any
  fileLimit?: number
  callback?: (row: any) => void
  bizType: string
  fileType?: string[]
  fileSize?: number
  pk?: string
  style?: string
  uploadRefresh?: boolean
  status?: string
  // key：file上传返回的的属性值
  // value：自定义提交业务使用的key
  columns?: {
    fileId?: string | number
    url?: string
    objectName?: string
    path?: string
    name?: string
    fileFormat?: string
  }
}

/**
 * 字段映射
 */
export interface Columns {
  [idx: number | string]: string | number
}

/**
 * 长文本类型
 */
export interface TextareaOption {
  minRows: number
  maxRows: number
  autosize?: { minRow?: number; maxRows?: number }
  width?: string
}

/**
 * switch类型
 */
export interface SwitchOption {
  activeValue: string | number
  inactiveValue: string | number
  style?: string
  api: any
  pk: string
  status?: string
}

/**
 * input类型
 */
export interface InputOption {
  readonly?: boolean
}

/**
 * 表格查询参数类型
 */
export interface QueryParams {
  [idx: number | string]: TagOption
}

/**
 * tag类型
 */
export interface TagOption {
  type?: '' | 'success' | 'warning' | 'info' | 'danger' | 'primary'
  name?: string
}

/**
 * 字段行内跳转字段属性类型
 */
export interface LinkInfo {
  // 前端定义的路由路径
  routePath?: string
  // 路由参数，行项目获取
  rowParam?: string[]
  // 路由参数
  query?: Query
  // 自定义显示的内容，从行项目获取
  columnName?: string
  // 自定义显示的内容
  fixColumnName?: string
}

/**
 * 字段行内跳转字段属性类型
 */
export interface LinkInfo2 {
  // 后台返回的url地址
  linkUrlProp?: string
  // 路由参数，行项目获取
  rowParam?: string[]
  // 路由参数
  query?: Query
  // 自定义显示的内容，从行项目获取
  columnName?: string
  // 自定义显示的内容
  fixColumnName?: string
}
/**
 * 链接字段属性查询类型
 */
export interface Query {
  [idx: string]: number | string
}
