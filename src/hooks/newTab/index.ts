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
  const { bizId, title, path, type, props } = option
  let _pageId: string
  if (bizId) {
    _pageId = type + '_' + bizId
  } else {
    _pageId = type + '_' + title
  }
  await router.push({
    name: 'TabWrapper',
    params: {
      pageId: _pageId,
      type: type,
      bizId: bizId,
      path: encodeURIComponent(btoa(path)),
    },
    query: {
      title: title,
      ...props,
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
