/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import pinia from '@/store'
import { listDict } from '@/api/system/dict'
import { Dict, DictItem, Dicts } from '@/types/types.ts'

import useDictStore from '@/store/modules/dict.ts'

const dictStore = useDictStore(pinia)

/**
 * 加载字典
 *
 * @param args
 */
export function useDict(...args: any[]): any {
  const dict = ref<Dicts>({})
  return ((): any => {
    if (args.length === 0) return
    args.forEach((code: any) => {
      if (typeof code !== 'string') throw Error('字段配置参数错误')
      dict.value[code] = {}
      const _dict: Dict = dictStore.getDict(code)
      if (_dict) {
        dict.value[code] = _dict
      } else {
        // 远程获取
        listDict(code).then((response: any) => {
          const result: Dict = {}
          response.data.forEach((item: DictItem): void => {
            result[item.value as number] = { label: item.label, value: item.value, type: item.type }
          })
          dict.value[code] = result
          dictStore.setDict(code, dict.value[code])
        })
      }
    })
    return toRefs(dict.value)
  })()
}
