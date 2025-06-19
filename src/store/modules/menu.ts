/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { defineStore, StoreDefinition, storeToRefs } from 'pinia'
import pinia from '@/store'
import router from '@/router'
import { ref, computed } from 'vue'
import type { MenuState } from './types/types'
import { constantChildRoutes } from '@/router/routes'
import type { RouteRecordRaw } from 'vue-router'
import { PermissionData, StorageName } from '@/types/types'
import useSettingStore from '@/store/modules/setting.ts'
import { GET_OBJ_ARRAY_STORAGE, SET_OBJ_ARRAY_STORAGE } from '@/utils/storage.ts'
import { listPermission } from '@/api/auth/menu'

const modules = import.meta.glob('@/views/**/**.vue')
const { settings } = storeToRefs(useSettingStore(pinia))

// 递归查找路由
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
const formatRouters = ({ pPath, menus = [] }: { pPath: string; menus: any[] }): RouteRecordRaw[] => {
  if (menus?.length == 0) {
    return []
  }

  const fmtRouters = [] as RouteRecordRaw[]
  menus?.forEach((menu: PermissionData): void => {
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

const useMenuStore: StoreDefinition<'Menu', MenuState> = defineStore('Menu', () => {
  // 状态定义
  const initMenu = ref(false)
  const currentMenu = ref<RouteRecordRaw>({} as RouteRecordRaw)
  const menuRoutes = ref<RouteRecordRaw[]>(constantChildRoutes)
  const subMenuRoutes = ref<RouteRecordRaw[]>(GET_OBJ_ARRAY_STORAGE(StorageName.mixMenuRoutes) as RouteRecordRaw[])

  // 查询权限方法
  const getPermission = async () => {
    try {
      const response: any = await listPermission(<string>settings.value.language)
      const fmtRouters: RouteRecordRaw[] = formatRouters({ pPath: '', menus: response.data })

      // 将格式化好的路由添加到router中
      fmtRouters.forEach((fmtRouter: RouteRecordRaw) => {
        router.addRoute('Layout', fmtRouter)
        // 主菜单路由信息
        menuRoutes.value.push(fmtRouter)
      })

      initMenu.value = true
      return Promise.resolve()
    } catch (err: any) {
      return Promise.reject(new Error(err.message))
    }
  }

  // 设置子节点菜单
  const setMenuChildren = (fmtRouter: RouteRecordRaw[]) => {
    return new Promise((resolve) => {
      subMenuRoutes.value = fmtRouter || []
      SET_OBJ_ARRAY_STORAGE(StorageName.mixMenuRoutes, subMenuRoutes.value)
      resolve(subMenuRoutes.value)
    })
  }

  // Getter：获取一级菜单信息
  const getOneLevelMenuInfo = computed(() => {
    return (attr: keyof RouteRecordRaw, value: string) => {
      return menuRoutes.value.find((item) => item[attr] === value)
    }
  })

  // Getter：获取混合模式左侧菜单
  const getMixLeftMenuInfo = () => {
    return new Promise((resolve) => {
      resolve(GET_OBJ_ARRAY_STORAGE(StorageName.mixMenuRoutes))
    })
  }

  // Getter：递归获取菜单信息
  const getMenuInfo = computed(() => {
    return (attr: keyof RouteRecordRaw, value: string) => {
      return findRouteByName(menuRoutes.value, attr, value)
    }
  })

  return {
    // 状态
    initMenu,
    currentMenu,
    menuRoutes,
    subMenuRoutes,

    // 方法
    getPermission,
    setMenuChildren,

    // Getter
    getOneLevelMenuInfo,
    getMixLeftMenuInfo,
    getMenuInfo,
  }
})

export default useMenuStore
