/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
export const loginRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/userLogin/index.vue'),
    meta: {
      title: 'login',
      hidden: true,
    },
  },
]

export const constantChildRoutes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '主页',
      icon: 'home',
      hidden: false,
      type: 1,
      href: 0,
    },
  },
  {
    path: '/screen',
    name: 'Screen',
    component: () => import('@/views/screen/index.vue'),
    meta: {
      title: 'Screen',
      icon: 'screen',
      hidden: false,
      type: 1,
      href: 0,
    },
  },
  {
    path: '/wo/startApproval1',
    name: 'StartApproval',
    component: () => import('@/views/wo/leave/startApproval/index.vue'),
    meta: {
      title: '开始审批',
      icon: 'startApproval',
      hidden: true,
      type: 1,
      href: 0,
    },
  },
  {
    path: '/task/todoApproval',
    name: 'TodoApproval',
    component: () => import('@/views/bpm/todoApproval/index.vue'),
    meta: {
      title: '审批流程',
      icon: 'todoApproval',
      hidden: true,
      type: 1,
      href: 0,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404',
      hidden: true,
      type: 1,
      href: 0,
    },
  },
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'Any',
  //   redirect: '/404',
  //   meta: {
  //     title: '任意路由',
  //     hidden: true,
  //   },
  // },
]

export const constantRoutes = [
  {
    path: '/redirect',
    name: 'Redirect',
    component: () => import('@/views/login/redirect/index.vue'),
    meta: {
      title: '重定向',
      icon: 'redirect',
      hidden: true,
      type: 1,
      href: 0,
    },
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '',
      hidden: false,
      type: 0,
      href: 0,
    },
    redirect: '/home',
    children: constantChildRoutes,
  },
]
