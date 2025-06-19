/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { ref } from 'vue'
import { defineStore, StoreDefinition } from 'pinia'
import type { TabsState } from '@/store/modules/types/types.ts'
import { StorageName, Tab, Tabs } from '@/types/types.ts'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import {
  GET_OBJ_ARRAY_STORAGE,
  GET_OBJ_STORAGE,
  GET_STR_ARRAY_STORAGE,
  GET_STRING_STORAGE,
  SET_OBJ_ARRAY_STORAGE,
  SET_OBJ_STORAGE,
  SET_STR_ARRAY_STORAGE,
  SET_STRING_STORAGE,
} from '@/utils/storage.ts'

// 固定主页Tab
export const homeConstantTab: Tab = {
  title: '主页',
  name: 'Home',
  path: '/home',
  fullPath: '/home',
  query: {},
  params: {},
  keepAlive: false,
  hidden: false,
}

// 存储操作公共函数
const saveTabsToStorage = (tabs: Tabs) => SET_OBJ_ARRAY_STORAGE(StorageName.Tabs, tabs)
const saveCacheTabsToStorage = (cacheTabs: string[]) => SET_STR_ARRAY_STORAGE(StorageName.CacheTabs, cacheTabs)
const saveCurrentTabToStorage = (tab: Tab) => SET_OBJ_STORAGE(StorageName.CurrentTab, tab)
const saveCurrentTabNameToStorage = (name: string) => SET_STRING_STORAGE(StorageName.CurrentTabName, name)

const useTabsStore: StoreDefinition<'Tabs', TabsState> = defineStore('Tabs', () => {
  // 响应式状态
  const contextMenuStatus = ref(false)
  const contextMenuLocationX = ref(0)
  const contextMenuLocationY = ref(0)

  // 初始化状态（从存储读取或默认值）
  const currentTabName = ref<string>(GET_STRING_STORAGE(StorageName.CurrentTabName) || homeConstantTab.name)
  const currentTab = ref<Tab>((GET_OBJ_STORAGE(StorageName.CurrentTab) as Tab) || homeConstantTab)
  const tabs = ref<Tabs>((GET_OBJ_ARRAY_STORAGE(StorageName.Tabs) as Tabs) || [homeConstantTab])
  const cacheTabs = ref<string[]>((GET_STR_ARRAY_STORAGE(StorageName.CacheTabs) as string[]) || [])

  // 私有方法：查找Tab索引
  const findTabIndex = (name: string): number => {
    return tabs.value.findIndex((item) => item.name === name)
  }

  // 初始化主页Tab
  const initHomeTab = (): void => {
    currentTabName.value = homeConstantTab.name
    saveCurrentTabNameToStorage(homeConstantTab.name)

    currentTab.value = homeConstantTab
    saveCurrentTabToStorage(homeConstantTab)

    tabs.value = [homeConstantTab]
    saveTabsToStorage([homeConstantTab])
  }

  // 设置Tab
  const setTab = (route: RouteLocationNormalizedLoaded): void => {
    if (tabs.value.length === 0) {
      initHomeTab() // 初始化主页Tab
      return
    }
    if (route.name === homeConstantTab.name) return

    // 构建Tab对象
    const tab: Tab = {
      title: route.meta.title as string,
      name: route.name as string,
      path: route.path,
      fullPath: route.fullPath,
      query: route.query,
      params: route.params,
      keepAlive: route.meta.keepAlive as boolean,
      hidden: route.meta.hidden as boolean,
    }

    // 处理带参数的Tab（如TabWrapper）
    if (tab.name === 'TabWrapper' && tab.params) {
      if (!cacheTabs.value.includes(tab.name)) {
        cacheTabs.value.push(tab.name)
        saveCacheTabsToStorage(cacheTabs.value)
      }
      tab.title = route.query.title as string
      tab.name = `${tab.name}-${tab.params.pageId}` // 拼接参数避免重复
    }

    // 新增Tab逻辑
    if (!tabs.value.some((t) => t.name === tab.name)) {
      tabs.value.push(tab)
      saveTabsToStorage(tabs.value)
    }
    // 处理缓存
    if (!cacheTabs.value.includes(tab.name) && route.meta.keepAlive) {
      cacheTabs.value.push(tab.name)
      saveCacheTabsToStorage(cacheTabs.value)
    }

    // 更新当前Tab
    currentTab.value = tab
    saveCurrentTabToStorage(tab)
    currentTabName.value = tab.name
    saveCurrentTabNameToStorage(tab.name)
  }

  // 删除Tab
  const removeTab = (targetName: string): void => {
    if (targetName === homeConstantTab.name) return

    const index = findTabIndex(targetName)
    let activeTab = currentTab.value

    // 删除当前Tab时，切换到相邻Tab
    if (activeTab.name === targetName) {
      activeTab = tabs.value[index + 1] || tabs.value[index - 1] || homeConstantTab
    }

    // 更新状态
    currentTab.value = activeTab
    saveCurrentTabToStorage(activeTab)
    currentTabName.value = activeTab.name
    saveCurrentTabNameToStorage(activeTab.name)

    tabs.value = tabs.value.filter((tab) => tab.name !== targetName)
    saveTabsToStorage(tabs.value)
  }

  // 删除右侧Tab
  const removeRightTab = (): void => {
    const currentIndex = findTabIndex(currentTabName.value)
    tabs.value.splice(currentIndex + 1, tabs.value.length - currentIndex)
    saveTabsToStorage(tabs.value)
  }

  // 删除左侧Tab
  const removeLeftTab = (): void => {
    const currentIndex = findTabIndex(currentTabName.value)
    tabs.value.splice(1, currentIndex - 1) // 保留主页和当前Tab左侧部分
    saveTabsToStorage(tabs.value)
  }

  // 初始化所有Tab（重置为主页）
  const initAllTab = (): void => {
    currentTabName.value = homeConstantTab.name
    saveCurrentTabNameToStorage(homeConstantTab.name)

    currentTab.value = homeConstantTab
    saveCurrentTabToStorage(homeConstantTab)

    tabs.value = [homeConstantTab]
    saveTabsToStorage([homeConstantTab])

    cacheTabs.value = []
    saveCacheTabsToStorage([])
  }

  // 删除当前Tab
  const removeCurrentTab = (): void => {
    const currentIndex = findTabIndex(currentTabName.value)
    tabs.value.splice(currentIndex, 1)
    saveTabsToStorage(tabs.value)

    const nextTab = tabs.value[currentIndex] || tabs.value[currentIndex - 1] || homeConstantTab
    currentTab.value = nextTab
    saveCurrentTabToStorage(nextTab)
    currentTabName.value = nextTab.name
    saveCurrentTabNameToStorage(nextTab.name)
  }

  // 删除其他Tab（保留主页和当前Tab）
  const removeOtherTab = (): void => {
    tabs.value = [homeConstantTab, ...tabs.value.filter((t) => t.name === currentTabName.value)]
    saveTabsToStorage(tabs.value)
  }

  // Getter：通过名称获取Tab
  const getCurrentTab = (targetName: string): Tab => {
    return tabs.value.find((item) => item.name === targetName) || homeConstantTab
  }

  return {
    // 状态
    contextMenuStatus,
    contextMenuLocationX,
    contextMenuLocationY,
    currentTabName,
    currentTab,
    tabs,
    cacheTabs,

    // 方法
    setTab,
    removeTab,
    removeRightTab,
    removeLeftTab,
    initAllTab,
    removeCurrentTab,
    removeOtherTab,

    // Getter
    getCurrentTab,
  }
})

export default useTabsStore
