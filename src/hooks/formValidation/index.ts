import { ElMessage } from 'element-plus'
import i18n from '@/i18n/index'

export const check = (obj: any): any => {
  // 如果 obj 是 null 或者不是对象，直接返回 false
  if (obj === null || typeof obj !== 'object') {
    return false
  }

  // 遍历对象的每一个属性
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]

      // 如果当前属性值是 NaN，返回 true
      if (value === 'NAN') {
        return true
      }

      // 如果当前属性值是对象，则递归调用函数
      if (typeof value === 'object' && check(value)) {
        return true
      }
    }
  }

  // 如果所有属性都不包含 NaN，则返回 false
  return false
}

export default function useFormValidation() {
  // 检查表单值是否等于 "NAN" 的函数
  function isNANValue(formValue: object) {
    if (check(formValue)) {
      ElMessage.warning({
        message: i18n.global.t('common.fail'),
        duration: 1000,
      })
      throw Error(i18n.global.t('common.fail'))
    }
    return true
  }

  // 返回需要暴露出去的数据和方法
  return {
    isNANValue,
  }
}
