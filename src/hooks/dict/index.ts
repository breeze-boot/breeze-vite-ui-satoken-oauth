/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import pinia from '@/store'
import { listDict } from '@/api/system/dict'
import { DictHook, StoreDictItem } from '@/types/types.ts'

import useDictStore from '@/store/modules/dict.ts'

const dictStore = useDictStore(pinia)

/**
 * 获取字典数据
 */
export function useDict(): any {
  /**
   * 加载字典
   *
   * @param args
   */
  const initDict = (args: any): any => {
    return new Promise((resolve) => {
      const dict = ref<DictHook>({})
      args.forEach((code: string) => {
        const dictList: StoreDictItem[] = dictStore.getDict(code)
        if (dictList.length > 0) {
          dict.value[code] = dictList
          return resolve(dict)
        }
        // 远程获取
        listDict(code).then((response: any) => {
          dict.value[code] = response.data.map(
            (item: StoreDictItem): StoreDictItem => ({
              label: item.label,
              value: item.value,
            }),
          )
          dictStore.setDict(code, dict.value[code])
        })
      })
      return resolve(dict)
    })
  }

  return {
    initDict,
  }
}
