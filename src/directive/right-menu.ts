/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import useTabsStore from '@/store/modules/tabs.ts'
import variables from '@/styles/variables.module.scss'

/**
 * 查询dom树元素中的节点
 *
 * @param node
 * @param className
 * @param els
 */
const findAllChildrenWithClass = (node: any, className: string, els: any) => {
  if (node.classList && node.classList.contains(className)) {
    els.push(node)
  }
  for (let i = 0; i < node.children.length; i++) {
    findAllChildrenWithClass(node.children[i], className, els)
  }
  return els
}

export const rightMenu = (app: any) => {
  const tabsStore = useTabsStore()

  /**
   * 全局自定义指令:右键菜单
   * 使用指令便于再指定位置获取dom
   */
  app.directive('right-menu', {
    updated(el: any, options: any, vnode: any) {
      console.debug(options, vnode)
      const nodes = findAllChildrenWithClass(el, 'el-tabs__item', [])
      nodes.forEach((node: any) => {
        if (!node.oncontextmenu) {
          const _node = node
          // 添加右击事件监听器
          node.oncontextmenu = function (e: any) {
            e.preventDefault() // 阻止默认的右键菜单显示
            // 当 item 点击才显示
            if (!e.target.classList.contains('el-tabs__item') || !e.target.classList.contains('is-active')) {
              return
            }
            if (e.target.id === 'tab-home' || e.target.id === 'home') {
              return
            }
            console.debug('当前的右击的tab', e.target.id)
            // 显示菜单
            tabsStore.contextMenuStatus = true
            tabsStore.contextMenuLocationX =
              _node.getBoundingClientRect().left +
              _node.clientWidth / -Number(variables.baseContextMenuWidth.toString().replace('px', '')) / 2
            tabsStore.contextMenuLocationY = _node.getBoundingClientRect().top + _node.clientHeight
            console.log('当前的右击的tab', _node)
            console.log(tabsStore.contextMenuLocationY)
            console.log(tabsStore.contextMenuLocationX)
          }
        }
      })
    },
  })
}
