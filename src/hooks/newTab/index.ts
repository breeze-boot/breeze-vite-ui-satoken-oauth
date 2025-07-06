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
  const { bizId, title, path, type, query } = option
  if (!path) {
    ElMessage.warning('未配置跳转的路由')
    return
  }
  // 生成唯一页面ID
  const pageId = bizId ? `${type}_${bizId}` : `${type}_${title}`
  await router.push({
    name: 'TabWrapper',
    params: {
      pageId: pageId,
      type: type,
      path: encodeURIComponent(btoa(path)),
      _t: new Date().getTime(),
    },
    query: {
      title,
      ...query,
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
