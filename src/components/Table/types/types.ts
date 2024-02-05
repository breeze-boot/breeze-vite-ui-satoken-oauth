/**
 * @author: gaoweixuan
 * @since: 2023-10-02
 */

/**
 * 按钮类型
 */
export interface btn {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'text' | ''
  label?: string
  icon?: string
  disabled?: boolean
  slot?: string
  slotName?: string
  permission?: string[]
  event: event
}

/**
 * 事件类型
 */
export type event = 'exportAll' | 'export' | 'del' | 'add' | string

/**
 * 表格类型
 */
export interface TableInfo {
  refresh: number
  pager?: boolean
  selection: boolean
  tableBtnGroup: btn[]
  fieldList: field[]
  tableIndex: boolean
  handle: handle
}

/**
 * 操作类型
 */
export interface handle {
  minWidth: number | 200
  label: string | '操作'
  fixed: 'right' | 'left'
  align?: string
  width?: string
  link?: boolean
  btList?: btn[]
}

/**
 * 表格字段类型
 */
export interface field {
  type?: string | 'tag' | 'link' | 'image' | 'customLink' | 'switch' | 'input' | 'upload' | 'dialogUpload'
  prop: string
  label: string
  switch?: switchOption
  input?: inputOption
  upload?: uploadOption
  linkName?: string
  dictCode?: string
  showOverflowTooltip?: boolean
  hidden?: boolean
  linkInfo?: linkInfo
  tagOptions?: tagOptions
  align?: 'center' | 'right' | 'left'
  width?: string
  minWidth?: string
  fixed?: boolean
  children?: children
}

/**
 * 表格嵌套类型
 */
export type children = field[]

/**
 * tag类型
 */
export interface tagOptions {
  [idx: number | string]: tagOption
}

/**
 * 文件上传类型
 */
export interface uploadOption {
  msg: string
  limit: number
  pk: string
  types: string[]
  api: string
}

/**
 * switch类型
 */
export interface switchOption {
  activeValue?: string | number
  inactiveValue?: string | number
  style?: string
  api?: any
  pk?: string
  status?: string
}

/**
 * input类型
 */
export interface inputOption {
  readonly?: boolean
}

/**
 * 表格查询参数类型
 */
export interface queryParams {
  [idx: number | string]: tagOption
}

/**
 * tag类型
 */
export interface tagOption {
  type?: '' | 'success' | 'warning' | 'info' | 'danger'
  name?: string
}

/**
 * 链接字段属性类型
 */
export interface linkInfo {
  routeName: string
  pkName?: string
  rowParam?: string[]
  query: query
}

/**
 * 链接字段属性查询类型
 */
export interface query {
  [idx: string]: number | string
}
