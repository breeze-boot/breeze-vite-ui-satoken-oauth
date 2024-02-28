/**
 * @author: gaoweixuan
 * @since: 2023-10-02
 */

/**
 * 按钮类型
 */
export interface Btn {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'text' | ''
  icon?: string
  label?: string
  disabled?: boolean
  slot?: string
  slotName?: string
  permission?: string[]
  link?: boolean
  event: Event
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
  handleBtn?: HandleBtn
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
  disabled?: boolean
  type?: string | 'tag' | 'link' | 'image' | 'customLink' | 'switch' | 'input' | 'upload' | 'dialogUpload'
  prop: string
  label: string
  switch?: SwitchOption
  input?: InputOption
  upload?: UploadOption
  linkName?: string
  dict?: string
  showOverflowTooltip?: boolean
  hidden?: boolean
  linkInfo?: LinkInfo
  tagOptions?: TagOptions
  align?: 'center' | 'right' | 'left'
  width?: string
  minWidth?: string
  fixed?: boolean
  children?: Field[]
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
  msg: string
  limit: number
  pk: string
  types: string[]
  api: string
}

/**
 * switch类型
 */
export interface SwitchOption {
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
  type?: '' | 'success' | 'warning' | 'info' | 'danger'
  name?: string
}

/**
 * 链接字段属性类型
 */
export interface LinkInfo {
  routeName: string
  pkName?: string
  rowParam?: string[]
  query: Query
}

/**
 * 链接字段属性查询类型
 */
export interface Query {
  [idx: string]: number | string
}
