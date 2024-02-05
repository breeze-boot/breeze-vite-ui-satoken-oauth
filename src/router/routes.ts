/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/userLogin/index.vue'),
    meta: {
      title: 'login',
      hidden: true,
    },
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '主页',
          hidden: false,
          icon: 'HomeFilled',
        },
      },
    ],
  },
  {
    path: '/screen',
    name: 'Screen',
    component: () => import('@/views/screen/index.vue'),
    meta: {
      title: 'Screen',
      hidden: false,
      icon: 'Platform',
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404',
      hidden: true,
    },
  },
]

export const anyRoute = {
  path: '/:pathMatch(.*)*',
  name: 'Any',
  redirect: '/404',
  meta: {
    title: '任意路由',
    hidden: true,
  },
}
