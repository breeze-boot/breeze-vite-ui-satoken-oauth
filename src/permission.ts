import router from '@/router'
import setting from '@/setting'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from '@/store'
import useUserStore from '@/store/modules/user'
import useMenuStore from '@/store/modules/menu'

nprogress.configure({ showSpinner: false })

const userStore = useUserStore(pinia)
const menuStore = useMenuStore(pinia)

/**
 * 全局前置守卫
 */
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title + ` | ${setting.title}`
  nprogress.start()
  const token: string = userStore.accessToken as string
  const initMenu: boolean = menuStore.initMenu as boolean
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (initMenu) {
        next()
      } else {
        try {
          await menuStore.listPermission()
          next({ ...to })
        } catch (error) {
          await userStore.logout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
// 全局后置守卫

router.afterEach(() => {
  nprogress.done()
})
