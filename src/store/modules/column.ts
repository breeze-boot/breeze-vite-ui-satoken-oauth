/**
 * @author: gaoweixuan
 * @since: 2024-07-18
 */

import { defineStore } from 'pinia'
import { ColumnState } from '@/store/modules/types/types.ts'
import { getRolesMenuColumns } from '@/api/auth/permission/menuColumn'
import type { ColumnCacheData } from '@/types/types'
import { GET_OBJ_STORAGE, SET_STORAGE } from '@/utils/storage.ts'
import { StorageName } from '@/types/types'

const useColumnStore = defineStore('Column', {
  state: (): ColumnState => {
    return {
      columns: GET_OBJ_STORAGE(StorageName.Columns) as ColumnCacheData[],
    }
  },
  actions: {
    async getRolesMenuColumns() {
      const response: any = await getRolesMenuColumns()
      if (response.code === '0000') {
        this.columns = response.data as ColumnCacheData[]
        SET_STORAGE(StorageName.Columns, this.columns)
      }
    },
    async getColumnByMenu(menu: string) {
      let columns: string[] = []
      this.columns.forEach((item: ColumnCacheData) => {
        if (menu === item.menu) {
          columns = [...item.columns, ...columns]
        }
      })
      return columns
    },
  },
})

export default useColumnStore
