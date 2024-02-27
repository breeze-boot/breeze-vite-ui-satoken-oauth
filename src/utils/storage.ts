/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { StorageName } from '@/types/types'

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
export const SET_STORAGE = (name: StorageName, data: object): void => {
  localStorage.setItem(name, JSON.stringify(data || {}))
}

/**
 * 获取object类型的数据
 *
 * @param name 键名
 * @constructor
 */
export const GET_OBJ_STORAGE = (name: StorageName): object => {
  let storage: string = ''
  try {
    storage = localStorage.getItem(name)!
  } catch (e) {
    localStorage.clear()
  }
  return !storage ? {} : JSON.parse(storage)
}

/**
 * 获取数组类型类型的数据
 *
 * @param name 键名
 * @constructor
 */
export const GET_ARRAY_STORAGE = (name: StorageName): string[] => {
  let storage: string = ''
  try {
    storage = localStorage.getItem(name)!
  } catch (e) {
    localStorage.clear()
  }
  return !storage ? ([] as string[]) : (JSON.parse(storage) as string[])
}

/**
 * 获取string类型的数据
 *
 * @param name 键名
 * @constructor
 */
export const GET_STRING_STORAGE = (name: StorageName): string => {
  return localStorage.getItem(name)!
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
 * 删除 localStorage 数据
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
 * 删除所有数据
 *
 * @constructor
 */
export const CLEAR_STORAGE = () => {
  localStorage.clear()
}
