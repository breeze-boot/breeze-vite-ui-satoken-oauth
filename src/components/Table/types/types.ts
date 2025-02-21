/**
 * @author: gaoweixuan
 * @since: 2023-10-02
 */

import { Arrayable } from 'element-plus/es/utils'
import { SelectData } from '@/types/types.ts'
import { FormItemRule } from 'element-plus/es/components/form'

/**
 * 事件类型
 */
export type Event = 'exportAll' | 'export' | 'delete' | 'add' | string
export type SelectEvent = 'multi' | 'single'
type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'text' | ''

/**
 * 按钮类型
 */
export interface Btn {
  // 使用枚举类型
  type?: ButtonType
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
  eventHandle?: (row: any, $index?: number) => Promise<void> | void
}

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

export type AlignType = 'center' | 'right' | 'left'

/**
 * 表格字段类型
 */
export type FieldType =
  | 'input-number'
  | 'tag'
  | 'slot'
  | 'expand'
  | 'customRowLink'
  | 'rowLink'
  | 'image'
  | 'switch'
  | 'upload'
  | 'file'
  | 'date'
  | 'select'
  | 'radio'
  | 'input'
  | 'textarea'

// 定义 formOptions 的联合类型
type FormOptionsUnion = SelectOptions | RadioOptions | InputOptions | InputNumberOptions

/**
 * 表格字段类型
 */
export interface Field {
  /**
   * 对齐方式，默认为左对齐
   */
  align?: AlignType
  /**
   * 子字段列表
   */
  children?: Field[]
  /**
   * 字典标识
   */
  dict?: string
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否可见
   */
  visible?: boolean
  /**
   * 是否固定列
   */
  fixed?: boolean
  /**
   * 表单选项，根据不同的 type 可能有不同的配置
   */
  formOptions?: FormOptionsUnion
  /**
   * 是否隐藏
   */
  hidden?: boolean
  /**
   * 唯一标识，可用于排序等操作
   */
  key?: number
  /**
   * 字段标签
   */
  label?: string
  /**
   * 链接信息
   */
  linkInfo?: LinkInfo | LinkInfo2
  /**
   * 最小宽度
   */
  minWidth?: string
  /**
   * 字段属性名，用于绑定数据
   */
  prop: string
  /**
   * 是否显示溢出tooltip，默认为 false
   */
  showOverflowTooltip?: boolean
  /**
   * 是否可排序，默认为 false，也可以设置为 'custom' 表示自定义排序
   */
  sortable?: boolean | 'custom'
  /**
   * 开关选项
   */
  switch?: SwitchOption
  /**
   * 标签选项
   */
  tag?: TagOptions
  /**
   * 文本域选项
   */
  textarea?: TextareaOption
  /**
   * 字段类型
   */
  type?: FieldType | string
  /**
   * 上传选项
   */
  upload?: UploadOption
  /**
   * 列宽度
   */
  width?: number | string
  /**
   * 滑块宽度
   */
  sliderWidth?: number
}

export interface FormOptions {
  handleChange?: (row: any) => void
  handleBlur?: (row: any) => void
  placeholder?: string
  disabled?: boolean
  isDisabled?: (field: Field, row: any) => boolean
  rules?: Arrayable<FormItemRule>
  type?: string
}

export interface SelectOptions extends FormOptions {
  options?: SelectData[]
  optionKey?: string // 后台行内返回的选项的字段名
}

export interface RadioOptions extends FormOptions {
  options?: SelectData[]
  optionKey?: string // 后台行内返回的选项的字段名
}

export interface InputOptions extends FormOptions {
  options?: SelectData[]
  optionKey?: string // 后台行内返回的选项的字段名
}

export interface InputNumberOptions extends FormOptions {
  max?: number
  min?: number
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
  pk?: string
  fileLimit?: number
  callback?: (row: any) => void
  bizType: string
  fileType?: string[]
  fileSize?: number
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
export interface Link {
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
export interface LinkInfo extends Link {
  // 前端定义的路由路径
  routePath?: string
}

/**
 * 字段行内跳转字段属性类型
 */
export interface LinkInfo2 extends Link {
  // 后台返回的url地址
  linkUrlProp?: string
}

/**
 * 链接字段属性查询类型
 */
export interface Query {
  [idx: string]: number | string
}
