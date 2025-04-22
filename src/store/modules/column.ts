/**
 * @author: gaoweixuan
 * @since: 2024-07-18
 */

import { defineStore } from 'pinia'
import { ColumnState } from '@/store/modules/types/types.ts'
import { getRolesMenuColumns, saveMenuColumn } from '@/api/auth/permission/menuColumn'
import type { ColumnCacheData } from '@/types/types'
import { GET_OBJ_ARRAY_STORAGE, SET_OBJ_ARRAY_STORAGE } from '@/utils/storage.ts'
import { StorageName } from '@/types/types'
import { useMessage } from '@/hooks/message'
import { useI18n } from 'vue-i18n'

const useColumnStore = defineStore('Column', {
  state: (): ColumnState => {
    return {
      columns: GET_OBJ_ARRAY_STORAGE(StorageName.Columns) as ColumnCacheData[],
    }
  },
  actions: {
    async getRolesMenuColumns() {
      try {
        const response: any = await getRolesMenuColumns()
        this.columns = response.data as ColumnCacheData[]
        SET_OBJ_ARRAY_STORAGE(StorageName.Columns, this.columns)
      } catch (err: any) {
        const { t } = useI18n()
        useMessage().error(`${t('common.fail')} ${err.message}`)
      }
    },
    async setColumnByMenu(data: ColumnCacheData) {
      try {
        await saveMenuColumn(data)
        await this.getRolesMenuColumns()
      } catch (err: any) {
        const { t } = useI18n()
        useMessage().error(`${t('common.fail')} ${err.message}`)
      }
    },
    async getColumnByMenu(menu: string) {
      let columns: string[] = []
      this.columns?.forEach((item: ColumnCacheData) => {
        if (menu === item.menu) {
          columns = [...item.columns, ...columns]
        }
      })
      return columns
    },
  },
})

export default useColumnStore
