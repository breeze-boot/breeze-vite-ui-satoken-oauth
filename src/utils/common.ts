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
  ADD = 'add',
  ADD_SUB = 'ADD_SUB',
  EDIT = 'EDIT',
}
export enum SORT {
  ASE = 'ascending',
  DESC = 'descending',
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
