/**
 * @author: gaoweixuan
 * @since: 2024-07-18
 */

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks/message'
import { defineStore, StoreDefinition } from 'pinia'
import type { ColumnState } from '@/store/modules/types/types.ts'
import type { ColumnCacheData } from '@/types/types'
import { GET_OBJ_ARRAY_STORAGE, SET_OBJ_ARRAY_STORAGE } from '@/utils/storage.ts'
import { getRolesMenuColumns, saveMenuColumn } from '@/api/auth/permission/menuColumn'
import { StorageName } from '@/types/types'

const useColumnStore: StoreDefinition<'Column', ColumnState> = defineStore('Column', () => {
  // 响应式状态
  const columns = ref<ColumnCacheData[]>(GET_OBJ_ARRAY_STORAGE(StorageName.Columns) as ColumnCacheData[])

  // 获取角色菜单列配置
  const fetchRolesMenuColumns = async () => {
    try {
      const response = await getRolesMenuColumns()
      columns.value = response.data as ColumnCacheData[]
      SET_OBJ_ARRAY_STORAGE(StorageName.Columns, columns.value)
    } catch (err: any) {
      useMessage().error(`${useI18n().t('common.fail')} ${err.message}`)
    }
  }

  // 设置菜单列配置
  const setColumnByMenu = async (data: ColumnCacheData) => {
    try {
      await saveMenuColumn(data)
      await fetchRolesMenuColumns()
    } catch (err: any) {
      useMessage().error(`${useI18n().t('common.fail')} ${err.message}`)
    }
  }

  // 获取菜单列配置
  const getColumnByMenu = (menu: string): string[] => {
    let result: string[] = []
    columns.value.forEach((item) => {
      if (item.menu === menu) {
        result = [...item.columns, ...result]
      }
    })
    return result
  }

  return {
    // 状态
    columns,

    // 方法
    fetchRolesMenuColumns,
    setColumnByMenu,
    getColumnByMenu,
  }
})

export default useColumnStore
