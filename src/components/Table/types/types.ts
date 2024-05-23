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
  label?: string
  disabled?: (event: string, row: any) => boolean
  hidden?: (event: string, row: any) => boolean
  slot?: string
  slotName?: string
  permission: string[]
  link?: boolean
  event: Event
  eventHandle?: (row: any, $index: number) => void
}

/**
 * 事件类型
 */
export type Event = 'exportAll' | 'export' | 'del' | 'add' | string

/**
 * 表格类型
 */
export interface TableInfo {
  refresh?: number
  mountedRefresh?: boolean
  dict?: string[]
  pager?: boolean
  select?: 'multi' | 'single'
  tbHeaderBtn?: Btn[]
  fieldList?: Field[]
  tableIndex?: boolean
  checkedRows?: object[] | number[] | string[]
  handleBtn?: HandleBtn
  defaultSort?: ColumnSort
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
  minWidth: number | 200
  label: string | '操作'
  fixed: 'right' | 'left'
  align?: string
  width?: string
  link?: boolean
  btList?: Btn[]
}

/**
 * 表格字段类型
 */
export interface Field {
  key?: number
  sortable?: boolean | 'custom'
  disabled?: boolean
  type?:
    | string
    | 'tag'
    | 'customRowLink'
    | 'rowLink'
    | 'image'
    | 'switch'
    | 'upload'
    | 'file'
    | 'select'
    | 'input'
    | 'textarea'
  prop: string
  label: string
  switch?: SwitchOption
  input?: InputOption
  upload?: UploadOption
  textarea?: TextareaOption
  dict?: string
  formOptions?: FormOptions
  showOverflowTooltip?: boolean
  hidden?: boolean
  linkInfo?: LinkInfo
  tag?: TagOptions
  align?: 'center' | 'right' | 'left'
  width?: string
  minWidth?: string
  fixed?: boolean
  children?: Field[]
}

export interface FormOptions {
  type?: string
  placeholder?: string
  rules: Arrayable<FormItemRule>
  tagSelect?: SelectData[]
  selectOptionKey?: string
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
  status: string
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
  // 路由路径
  routePath?: string
  // url地址
  linkUrlProp?: string
  // 路由参数，行项目获取
  rowParam?: string[]
  // 路由参数
  query?: Query
  // 自定义显示的内容，从行项目获取
  dyColumnName?: string
  // 自定义显示的内容
  fixColumnName?: string
}

/**
 * 链接字段属性查询类型
 */
export interface Query {
  [idx: string]: number | string
}
