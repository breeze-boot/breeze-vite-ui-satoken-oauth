/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { StorageName } from '@/types/types'

// 提取公共的获取localStorage数据逻辑，增加更合理的错误处理
const getLocalStorageData = (name: StorageName): string | null => {
  try {
    return localStorage.getItem(name)
  } catch (e) {
    console.error(`Error getting data from localStorage with key ${name}:`, e)
    return null
  }
}

/**
 * 保存string类型的数据到 localStorage
 *
 * @param name 键名
 * @param data 数据
 * @constructor
 */
export const SET_STRING_STORAGE = (name: StorageName, data: string): void => {
  localStorage.setItem(name, data)
}

/**
 * 保存object类型的数据到 localStorage
 *
 * @param name 键名
 * @param data 数据
 * @constructor
 */
export const SET_OBJ_STORAGE = (name: StorageName, data: object): void => {
  localStorage.setItem(name, JSON.stringify(data || {}))
}

/**
 * 保存object类型的数据到 localStorage
 *
 * @param name 键名
 * @param data 数据
 * @constructor
 */
export const SET_OBJ_ARRAY_STORAGE = (name: StorageName, data: object[]): void => {
  localStorage.setItem(name, JSON.stringify(data || []))
}
/**
 * 保存object类型的数据到 localStorage
 *
 * @param name 键名
 * @param data 数据
 * @constructor
 */
export const SET_STR_ARRAY_STORAGE = (name: StorageName, data: string[]): void => {
  localStorage.setItem(name, JSON.stringify(data || []))
}

/**
 * 获取object类型的数据
 *
 * @param name 键名
 * @constructor
 */
export const GET_OBJ_STORAGE = (name: StorageName): object => {
  const storage = getLocalStorageData(name)
  return storage ? JSON.parse(storage) : {}
}

/**
 * 获取object类型的数据（数组形式）
 *
 * @param name 键名
 * @constructor
 */
export const GET_OBJ_ARRAY_STORAGE = (name: StorageName): object[] => {
  const storage = getLocalStorageData(name)
  return storage ? (JSON.parse(storage) as object[]) : []
}

/**
 * 获取数组类型的数据
 *
 * @param name 键名
 * @constructor
 */
export const GET_STR_ARRAY_STORAGE = (name: StorageName): string[] => {
  const storage = getLocalStorageData(name)
  return storage ? (JSON.parse(storage) as string[]) : []
}

/**
 * 获取string类型的数据
 *
 * @param name 键名
 * @constructor
 */
export const GET_STRING_STORAGE = (name: StorageName): string => {
  const storage = getLocalStorageData(name)
  return storage || ''
}

/**
 * 删除 localStorage 数据
 *
 * @param name 键名
 * @constructor
 */
export const REMOVE_STORAGE = (name: StorageName) => {
  localStorage.removeItem(name)
}

/**
 * 删除 localStorage 中多个数据
 *
 * @param names 键名数组
 * @constructor
 */
export const REMOVE_STORAGES = (names: StorageName[]) => {
  names.forEach((item: string) => {
    localStorage.removeItem(item)
  })
}

/**
 * 删除所有localStorage数据
 *
 * @constructor
 */
export const CLEAR_STORAGE = () => {
  localStorage.clear()
}
