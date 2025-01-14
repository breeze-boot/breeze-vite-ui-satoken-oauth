import useTabsStore from '@/store/modules/tabs.ts'
import router from '@/router'
import pinia from '@/store'

const tabsStore = useTabsStore(pinia)

/**
 * 创建Tab页面
 *
 * @param $route
 * @param option
 */
export const useNewTab = async ($route: any, option: any) => {
  await router.push({
    name: 'Approve',
    params: {
      pageId: option.pageId,
    },
    query: {
      title: option.title,
      path: option.path,
      ...option.query,
    },
  })
  tabsStore.setTab($route)
}

/**
 * 关闭Tab页面
 */
export const useCloseTab = async ($router: any) => {
  await $router.back()
  tabsStore.removeCurrentTab()
}
