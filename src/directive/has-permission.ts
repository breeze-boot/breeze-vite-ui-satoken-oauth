/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import pinia from '@/store'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore(pinia)

export const isHasPermission = (app: any) => {
  /**
   * 全局自定义指令:实现按钮的权限
   */
  app.directive('has', {
    // 代表使用这个全局自定义指令的DOM|组件挂载完毕的时候会执行一次
    mounted(el: any, options: any) {
      // 如果在用户信息roleCodes数组当中没有
      // 如果在用户信息buttons数组当中没有
      filterOptions(el, options)
    },
  })
}

const filterOptions = (el: any, options: any) => {
  options.value.forEach((item: string) => {
    if (!userStore.roleCodes.includes(item) && !userStore.permissions.includes(item)) {
      // 删除DOM元素
      el.parentNode.removeChild(el)
    }
  })
}
