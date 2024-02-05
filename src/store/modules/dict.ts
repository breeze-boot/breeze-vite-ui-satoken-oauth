/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { defineStore } from 'pinia'
import { DictState } from '@/store/modules/types/types.ts'
import { StoreDict, StoreDictItem } from '@/types/types.ts'

const useDictStore = defineStore('Dict', {
  state: (): DictState => {
    return {
      dict: [] as StoreDict[],
    }
  },
  actions: {
    /**
     * 获取字典
     *
     * @param code
     */
    getDict(code: string): StoreDictItem[] {
      const item = this.dict.find((item: StoreDict): boolean => item.code === code)
      return item ? item.dictItem : []
    },
    /**
     * 设置字典
     *
     * @param code
     * @param dictItem
     */
    setDict(code: string, dictItem: StoreDictItem[]): void {
      if (!code) {
        return
      }

      const _dict = { code, dictItem }
      this.dict.push(_dict)
    },
    /**
     * 删除字典
     *
     * @param code
     */
    removeDict(code: string): boolean {
      const index = this.dict.findIndex((item: StoreDict): boolean => item.code === code)
      if (index !== -1) {
        this.dict.splice(index, 1)
        return true
      }
      return false
    },
  },
})

export default useDictStore
