/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { defineStore, storeToRefs } from 'pinia'
import pinia from '@/store'
import router from '@/router'
import { listPermission } from '@/api/login'
import type { MenuState } from './types/types'
import { constantChildRoutes } from '@/router/routes'
import type { RouteRecordRaw } from 'vue-router'
import { PermissionData, StorageName } from '@/types/types'
import useSettingStore from '@/store/modules/setting.ts'
import { GET_OBJ_STORAGE, SET_STORAGE } from '@/utils/storage.ts'

const modules = import.meta.glob('@/views/**/**.vue')
const { settings } = storeToRefs(useSettingStore(pinia))

const findRouteByName = (
  routes: RouteRecordRaw[],
  attr: keyof RouteRecordRaw,
  value: string,
): RouteRecordRaw | undefined => {
  for (const route of routes) {
    if (route[attr] === value) {
      return route
    }
    if (route.children) {
      const found: RouteRecordRaw | undefined = findRouteByName(route.children, attr, value)
      if (found) {
        return found
      }
    }
  }
  return undefined
}

/**
 * 格式化动态路由
 *
 * @param pPath
 * @param menus 动态路由
 */
const formatRouters = ({ pPath, menus }: { pPath: string; menus: any }): RouteRecordRaw[] => {
  if (menus.length == 0) {
    return []
  }

  const fmtRouters = [] as RouteRecordRaw[]
  menus.forEach((menu: PermissionData): void => {
    const { name, path, component, href } = menu
    let { children } = menu
    // 递归格式化children路由
    if (children) {
      children = formatRouters({ pPath: menu.path, menus: children }) as RouteRecordRaw[]
    }
    const fmtRouter = {
      name: name as string,
      path: (href === 1 ? path : (pPath as string) + path) as string,
      meta: {
        icon: menu.icon as string,
        title: menu.title as string,
        type: menu.type as number,
        hidden: (menu.hidden as number) === 1,
        href: menu.href as number,
        keepAlive: (menu.keepAlive as number) === 1,
      },
      component: modules[`/src/views${component}.vue`],
      children: children as RouteRecordRaw[],
    }
    fmtRouters.push(fmtRouter)
  })
  return fmtRouters
}

const useMenuStore = defineStore('Menu', {
  /**
   * 仓库存储数据
   *
   * @returns
   */
  state: (): MenuState => {
    return {
      initMenu: false,
      menuRoutes: constantChildRoutes,
      mixMenuRoutes: GET_OBJ_STORAGE(StorageName.mixMenuRoutes) as RouteRecordRaw[],
    }
  },
  /**
   *  异步|逻辑
   */
  actions: {
    /**
     * 查询权限方法
     *
     * @returns
     */
    listPermission: async function () {
      const response = await listPermission(<string>settings.value.language)
      if (response) {
        // 动态路由请求成功后，将路由格式化成vue能识别的路由形式
        const fmtRouters: RouteRecordRaw[] = formatRouters({ pPath: '', menus: response.data })
        // 将格式化好的路由添加到router中
        fmtRouters.forEach((fmtRouter: RouteRecordRaw) => {
          router.addRoute('Layout', fmtRouter)
          // 主菜单路由信息
          this.menuRoutes.push(fmtRouter)
        })
        this.initMenu = true
        return Promise.resolve()
      }
      return Promise.reject(new Error(response))
    },
    /**
     * 设置子节点的菜单
     *
     * @param fmtRouter
     */
    setMenuChildren(fmtRouter: RouteRecordRaw[]) {
      // 子菜单路由信息
      return new Promise((resolve) => {
        this.mixMenuRoutes = fmtRouter as RouteRecordRaw[]
        SET_STORAGE(StorageName.mixMenuRoutes, this.mixMenuRoutes)
        resolve(this.mixMenuRoutes)
      })
    },
  },
  getters: {
    /**
     * 获取菜单信息
     *
     * @param state
     */
    getOneLevelMenuInfo: (state: MenuState) => {
      return (attr: keyof RouteRecordRaw, value: string) => {
        return state.menuRoutes.find((item: RouteRecordRaw): boolean => {
          return item[attr] === value
        })
      }
    },
    /**
     * 获取当前混合模式的左侧菜单信息
     */
    getMixLeftMenuInfo: () => {
      return () => {
        // 子菜单路由信息
        return new Promise((resolve) => resolve(GET_OBJ_STORAGE(StorageName.mixMenuRoutes)))
      }
    },
    /**
     * 递归获取菜单信息
     *
     * @param state
     */
    getMenuInfo: (state: MenuState) => {
      return (attr: keyof RouteRecordRaw, value: string) => findRouteByName(state.menuRoutes, attr, value)
    },
  },
})

export default useMenuStore
