export default {
  menu: {
    common: {
      addSubMenu: '添加子菜单',
    },
    fields: {
      platformId: '平台',
      parentMenu: '上级菜单',
      title: '标题',
      name: '组件名称',
      sort: '排序',
      icon: '图标',
      permission: '权限标识',
      path: '菜单路径',
      component: '组件路径',
      keepAlive: '缓存',
      hidden: '是否隐藏',
      href: '外链',
      type: '类型',
    },
    rules: {
      platformId: '请选择所属的平台',
      name: '请输入菜单名称',
      title: '请输入组件的标题',
      permission: '请输入权限标识',
      path: '请输入路由访问路径',
      component: '请输入vue组件路径',
    },
  },
}
