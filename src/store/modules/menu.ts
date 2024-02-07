/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { defineStore } from 'pinia'
import router from '@/router'
import { listPermission } from '@/api/login'
import type { MenuState } from './types/types'
import { anyRoute, constantChildRoutes } from '@/router/routes'
import type { RouteRecordRaw } from 'vue-router'
import { PermissionData, StorageName } from '@/types/types'
import useSettingStore from '@/store/modules/setting.ts'
import { GET_STORAGE, SET_STORAGE } from '@/utils/storage.ts'

const modules = import.meta.glob('@/views/**')
const settings = useSettingStore().settings

const findRouteByName = (routes: RouteRecordRaw[], attr: keyof RouteRecordRaw, name: string): RouteRecordRaw => {
  return routes.find((route: RouteRecordRaw) => {
    if (route[attr] === name) {
      return true
    }
    if (route.children) {
      return findRouteByName(route.children, attr, name)
    }
  }) as RouteRecordRaw
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
        hidden: (menu.hidden as number) != 0,
        href: menu.href as number,
      },
      // component: () => import(/* @vite-ignore */`@/views${component}.vue`),
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
      mixMenuRoutes: GET_STORAGE(StorageName.mixMenuRoutes) as RouteRecordRaw[],
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
      const response = await listPermission(<string>settings.language)
      if (response) {
        // 动态路由请求成功后，将路由格式化成vue能识别的路由形式
        const fmtRouters: RouteRecordRaw[] = formatRouters({ pPath: '', menus: response.data })
        // 将格式化好的路由添加到router中
        fmtRouters.forEach((fmtRouter: RouteRecordRaw) => {
          router.addRoute('Layout', fmtRouter)
          // 主菜单路由信息
          this.menuRoutes.push(fmtRouter)
        })
        router.addRoute('Layout', anyRoute)
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
      return (attr: keyof RouteRecordRaw, value: string) =>
        state.menuRoutes.find((item: RouteRecordRaw): boolean => item[attr] === value)
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
