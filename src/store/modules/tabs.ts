/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { defineStore } from 'pinia'
import type { TabsState } from '@/store/modules/types/types.ts'
import { StorageName, Tab, Tabs } from '@/types/types.ts'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import {
  GET_STR_ARRAY_STORAGE,
  GET_OBJ_ARRAY_STORAGE,
  GET_OBJ_STORAGE,
  GET_STRING_STORAGE,
  SET_OBJ_ARRAY_STORAGE,
  SET_OBJ_STORAGE,
  SET_STR_ARRAY_STORAGE,
  SET_STRING_STORAGE,
} from '@/utils/storage.ts'

// 定义一个固定的主页Tab，方便后续多处使用
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

const useTabsStore = defineStore('Tabs', {
  state: (): TabsState => {
    return {
      contextMenuStatus: false,
      contextMenuLocationX: 0,
      contextMenuLocationY: 0,
      // 若从存储读取失败，赋予默认的主页Tab名称
      currentTabName: GET_STRING_STORAGE(StorageName.CurrentTabName) || homeConstantTab.name,
      // 若从存储读取失败，赋予默认的主页Tab对象
      currentTab: (GET_OBJ_STORAGE(StorageName.CurrentTab) as Tab) || homeConstantTab,
      tabs: (GET_OBJ_ARRAY_STORAGE(StorageName.Tabs) as Tabs) || [homeConstantTab],
      cacheTabs: (GET_STR_ARRAY_STORAGE(StorageName.CacheTabs) as string[]) || [],
    }
  },
  actions: {
    /**
     * 查找指定名称的Tab在tabs数组中的索引，提取成私有方法方便复用
     * @param name 要查找的Tab名称
     * @private
     */
    findTabIndex(name: string): number {
      return this.tabs.findIndex((item: Tab): boolean => {
        return item.name === name
      })
    },

    /**
     * 设置选项卡
     *
     * @param route 路由对象，包含了页面相关的各种信息，如标题、路径、参数等
     */
    setTab(route: RouteLocationNormalizedLoaded): void {
      if (this.tabs.length === 0) {
        this.currentTabName = homeConstantTab.name
        this.currentTab = homeConstantTab
        this.tabs.push(homeConstantTab)
      }
      if (route.name === homeConstantTab.name) {
        return
      }
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

      if ((tab.name === 'TabWrapper' || tab.name === 'Approve') && tab.params) {
        tab.name = tab.name + '-' + tab.params.pageId
        tab.title = route.query.title as string
      }
      if (!this.tabs.some((_t: Tab): boolean => _t.name === tab.name)) {
        this.tabs.push(tab)
        SET_OBJ_ARRAY_STORAGE(StorageName.Tabs, this.tabs)
      }
      if (!this.cacheTabs.some((name: string): boolean => name === tab.name) && route.meta.keepAlive) {
        this.cacheTabs.push(tab.name)
        SET_STR_ARRAY_STORAGE(StorageName.CacheTabs, this.cacheTabs)
      }
      this.currentTab = tab
      SET_OBJ_STORAGE(StorageName.CurrentTab, tab)
      this.currentTabName = tab.name
      SET_STRING_STORAGE(StorageName.CurrentTabName, tab.name)
    },

    /**
     * 删除指定名称的选项卡
     * 如果要删除的选项卡是主页（homeConstantTab.name）则直接返回不做处理。
     * 当删除当前激活的选项卡时，会尝试查找相邻的选项卡作为新的激活选项卡，并更新相关状态和存储。
     * @param targetName 要删除的选项卡的名称
     */
    removeTab(targetName: string): void {
      if (targetName === homeConstantTab.name) {
        return
      }
      const index = this.findTabIndex(targetName)
      let activeTab: Tab = this.currentTab
      if (activeTab.name === targetName) {
        const nextTab: Tab = this.tabs[index + 1] || this.tabs[index - 1]
        if (nextTab) {
          activeTab = nextTab
        }
      }

      this.currentTab = activeTab
      SET_OBJ_STORAGE(StorageName.CurrentTab, this.currentTab)
      this.currentTabName = activeTab?.name
      SET_STRING_STORAGE(StorageName.CurrentTabName, this.currentTabName)
      const _tabs: Tab[] = this.tabs.filter((tab: Tab): boolean => tab.name !== targetName)
      this.tabs = _tabs ? _tabs : []
      SET_OBJ_ARRAY_STORAGE(StorageName.Tabs, this.tabs)
    },

    /**
     * 删除右侧选项卡
     */
    removeRightTab(): void {
      const activeName: Tab = this.currentTab
      const currentIndex: number = this.findTabIndex(activeName.name)
      this.tabs.splice(currentIndex + 1, this.tabs.length - currentIndex)
      SET_OBJ_ARRAY_STORAGE(StorageName.Tabs, this.tabs)
    },

    /**
     * 删除左侧选项卡，修正后的逻辑，删除从索引1到当前Tab索引（不包含当前Tab索引）的元素
     */
    removeLeftTab(): void {
      const activeName: Tab = this.currentTab
      const currentIndex: number = this.findTabIndex(activeName.name)
      this.tabs.splice(1, currentIndex - 1)
      SET_OBJ_ARRAY_STORAGE(StorageName.Tabs, this.tabs)
    },

    /**
     * 初始化所有选项卡，将相关状态重置为默认的主页Tab相关状态，并更新存储
     */
    initAllTab(): void {
      this.currentTabName = homeConstantTab.name
      SET_STRING_STORAGE(StorageName.CurrentTabName, this.currentTabName)
      this.currentTab = homeConstantTab
      SET_OBJ_STORAGE(StorageName.CurrentTab, this.currentTab)
      this.tabs = [homeConstantTab]
      SET_OBJ_ARRAY_STORAGE(StorageName.Tabs, this.tabs)
    },

    /**
     * 删除当前激活的选项卡，并尝试设置新的激活选项卡（如果存在），同时更新相关状态和存储
     */
    removeCurrentTab(): void {
      const activeName: Tab = this.currentTab
      const currentIndex: number = this.findTabIndex(activeName.name)
      this.tabs.splice(currentIndex, 1)
      SET_OBJ_ARRAY_STORAGE(StorageName.Tabs, this.tabs)
      const nextTab: Tab = this.tabs[currentIndex] || this.tabs[currentIndex - 1]
      if (nextTab) {
        this.currentTab = nextTab
        SET_OBJ_STORAGE(StorageName.CurrentTab, this.currentTab)
        this.currentTabName = nextTab.name
        SET_STRING_STORAGE(StorageName.CurrentTabName, this.currentTabName)
      }
    },

    /**
     * 删除除当前激活选项卡之外的其他所有选项卡，通过先获取当前Tab索引，然后构建只包含当前Tab的新数组来实现
     */
    removeOtherTab(): void {
      const activeName: Tab = this.currentTab
      const currentIndex: number = this.findTabIndex(activeName.name)
      const newTabs = [homeConstantTab, this.tabs[currentIndex]]
      SET_OBJ_ARRAY_STORAGE(StorageName.Tabs, newTabs)
      this.tabs = newTabs
    },
  },
  getters: {
    getCurrentTab: (state: TabsState) => {
      return (targetName: string): Tab => {
        let _tab: Tab = {} as Tab
        state.tabs.forEach((item: Tab): void => {
          if (item.name === targetName) {
            _tab = item
          }
        })
        return _tab
      }
    },
  },
})

export default useTabsStore
