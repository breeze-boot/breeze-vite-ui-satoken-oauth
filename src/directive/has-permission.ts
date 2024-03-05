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
    async mounted(el: any, options: any) {
      await filterOptions(el, options)
    },
  })
}

const filterOptions = async (el: any, options: any) => {
  if (!options.value) return
  for (const item of options.value) {
    const permissions: string[] = await userStore.getPermissions()
    if (!permissions.includes(item)) {
      // 删除DOM元素
      el.parentNode.removeChild(el)
    }
  }
}
