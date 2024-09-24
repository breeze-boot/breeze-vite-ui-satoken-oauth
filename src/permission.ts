import router from '@/router'
import setting from '@/setting'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from '@/store'
import useUserStore from '@/store/modules/user'
import useMenuStore from '@/store/modules/menu'

nprogress.configure({ showSpinner: false })

const whiteRoute: string[] = ['/redirect', '/login']
const userStore = useUserStore(pinia)
const menuStore = useMenuStore(pinia)

/**
 * 全局前置守卫
 */
router.beforeEach(async (to, from, next) => {
  document.title = (to.meta.title || '') + ` | ${setting.title}`
  nprogress.start()

  const token = userStore.accessToken as string
  const initMenu = menuStore.initMenu as boolean
  debugger
  // 用户已登录
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' }) // 重定向到主页
      return
    }

    if (!initMenu) {
      try {
        await menuStore.listPermission()
        next({ ...to, replace: true }) // 加载菜单后重定向
        return
      } catch (error) {
        await userStore.logout()
        next({ path: '/login', query: { redirect: to.path } })
        return
      }
    }

    // 处理无效路由
    if (to.matched.length === 0) {
      from.name ? next({ name: from.name }) : next('/404')
      return
    }

    // 继续导航
    next()
    return
  }

  // 用户未登录
  if (whiteRoute.includes(to.path)) {
    next() // 白名单路由直接放行
    return
  }

  // 重定向到登录
  next({ path: '/login', query: { redirect: to.path, ...to.query } })
})

// 全局后置守卫

router.afterEach(() => {
  nprogress.done()
})
