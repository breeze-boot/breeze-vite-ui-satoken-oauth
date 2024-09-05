/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { defineStore } from 'pinia'
import type { TabsState } from '@/store/modules/types/types.ts'
import { Tab, Tabs } from '@/types/types.ts'
import { RouteLocationNormalizedLoaded } from 'vue-router'

const constantTab: Tab = {
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
      currentTabName: constantTab.name,
      currentTab: constantTab,
      tabs: [constantTab],
      cacheTabs: [],
    }
  },
  actions: {
    /**
     * 设置选项卡
     *
     * @param route
     */
    setTab(route: RouteLocationNormalizedLoaded): void {
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
      if (!this.tabs.some((_t: Tab): boolean => _t.name === tab.name)) {
        this.tabs.push(tab)
      }
      if (!this.cacheTabs.some((name: string): boolean => name === tab.name) && route.meta.keepAlive) {
        this.cacheTabs.push(tab.name)
      }

      this.currentTab = tab
      this.currentTabName = tab.name
    },
    /**
     * 设置选项卡
     *
     * @param targetName
     */
    removeTab(targetName: string): void {
      const tabs: Tabs = this.tabs
      let activeTab: Tab = this.currentTab
      if (targetName === constantTab.name) {
        return
      }
      if (activeTab.name === targetName) {
        tabs.forEach((tab: Tab, index: number): void => {
          if (tab.name === targetName) {
            const nextTab: Tab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeTab = nextTab
            }
          }
        })
      }

      this.currentTab = activeTab
      this.currentTabName = activeTab.name
      this.tabs = tabs.filter((tab: Tab): boolean => tab.name !== targetName)
    },
    /**
     * 删除右侧选项卡
     */
    removeRightTab(): void {
      // 检查索引是否在数组范围内
      const activeName: Tab = this.currentTab
      const currentIndex: number = this.tabs.findIndex((item: Tab): boolean => {
        return item.name === activeName.name
      })
      this.tabs.splice(currentIndex + 1, this.tabs.length - currentIndex)
    },
    /**
     * 删除左侧选项卡
     */
    removeLeftTab(): void {
      // 检查索引是否在数组范围内
      const activeName: Tab = this.currentTab
      const currentIndex: number = this.tabs.findIndex((item: Tab): boolean => {
        return item.name === activeName.name
      })
      this.tabs.splice(1, currentIndex - 1)
    },
    /**
     * 删除全部
     */
    removeAllTab(): void {
      this.currentTabName = constantTab.name
      this.currentTab = constantTab
      this.tabs = [constantTab]
    },
    /**
     * 删除当前
     */
    removeCurrentTab(): void {
      // 检查索引是否在数组范围内
      const activeName: Tab = this.currentTab
      const currentIndex: number = this.tabs.findIndex((item: Tab): boolean => {
        return item.name === activeName.name
      })
      this.tabs.splice(currentIndex, 1)
      const nextTab: Tab = this.tabs[currentIndex] || this.tabs[currentIndex - 1]
      if (nextTab) {
        this.currentTab = nextTab
        this.currentTabName = nextTab.name
      }
    },
    removeOtherTab(): void {
      this.removeRightTab()
      this.removeLeftTab()
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
