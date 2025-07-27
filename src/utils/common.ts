/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import * as CryptoJS from 'crypto-js'
import { SelectData } from '@/types/types.ts'

export const ROOT: SelectData = {
  value: '1111111111111111111',
  label: '根节点',
}

export enum DIALOG_FLAG {
  ADD = 'ADD',
  ADD_SUB = 'ADD_SUB',
  EDIT = 'EDIT',
}

export enum DEVICE {
  PC = 'PC',
  PAD = 'PAD',
  MOBILE = 'MOBILE',
}

export enum LAYOUT {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  MIX = 'mix',
  COLUMNS = 'columns',
}

export enum MENU_TYPE {
  FOLDER = 0,
  MENU = 1,
  BUTTON = 2,
}

export enum MENU_HREF {
  HREF = 1,
  MENU = 0,
}

export enum THEME {
  LIGHT = 'light',
  DARK = 'dark',
}
export enum LANGUAGE {
  ZH_CN = 'zhCn',
  EN = 'en',
}

export const camelCaseToUnderscore = (val: string) => {
  return val.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
}

/**
 * 定义一个递归函数，用于将对象中的 BigNumber 类型的值转换为字符串类型
 */
export const convertBigNumberToString = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (obj._isBigNumber) {
    return obj.toString()
  } else if (Array.isArray(obj)) {
    return obj.map((item) => convertBigNumberToString(item))
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj[key] = convertBigNumberToString(obj[key])
    }
  }
  return obj
}

/**
 * 加密
 *
 * @param content
 * @param key
 * @returns {string}
 */
export const encrypt = (content: string, key: string) => {
  const sKey = CryptoJS.enc.Utf8.parse(key)
  const sContent = CryptoJS.enc.Utf8.parse(content)
  const encrypted = CryptoJS.AES.encrypt(sContent, sKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

/**
 * 解密
 *
 * @param content
 * @param key
 * @returns {*}
 */
export const decrypt = (content: string, key: string) => {
  const sKey = CryptoJS.enc.Utf8.parse(key)
  const decrypt = CryptoJS.AES.decrypt(content, sKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

// 格式化金额
export const formatCurrency = (value: number) => {
  if (isNaN(value)) return '0.00'
  return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
