/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { defineStore } from 'pinia'
import { DictState } from '@/store/modules/types/types.ts'
import { Dict, Dicts } from '@/types/types.ts'

const useDictStore = defineStore('Dict', {
  state: (): DictState => {
    return {
      dict: {} as Dicts,
    }
  },
  actions: {
    /**
     * 获取字典
     *
     * @param code
     */
    getDict(code: string): Dict {
      return this.dict[code]
    },
    /**
     * 设置字典
     *
     * @param code
     * @param dict
     */
    setDict(code: string, dict: Dict): void {
      if (!code) {
        return
      }
      this.dict[code] = dict
    },
  },
})

export default useDictStore
