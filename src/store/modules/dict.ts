/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { ref } from 'vue'
import { defineStore, StoreDefinition } from 'pinia'
import type { DictState } from '@/store/modules/types/types.ts'
import { Dict, Dicts } from '@/types/types.ts'

const useDictStore: StoreDefinition<'Dict', DictState> = defineStore('Dict', () => {
  // 响应式状态
  const dict = ref<Dicts>({} as Dicts)

  // 获取字典
  const getDict = (code: string): Dict => {
    return dict.value[code] || {}
  }

  // 设置字典
  const setDict = (code: string, dictData: Dict): void => {
    if (!code) return
    dict.value[code] = dictData
  }

  return {
    // 状态
    dict,

    // 方法
    getDict,
    setDict,
  }
})

export default useDictStore
