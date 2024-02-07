/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes, loginRoutes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...loginRoutes, ...constantRoutes],
  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router
