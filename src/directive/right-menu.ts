/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import useTabsStore, { homeConstantTab } from '@/store/modules/tabs.ts'
import { nextTick } from 'vue'

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

const menu = (el: any) => {
  const tabsStore = useTabsStore()
  // 查找自定义tabs中的标签项（匹配自定义组件的.tab-item类名）
  const nodes = findAllChildrenWithClass(el, 'tab-item', [])

  nodes.forEach((node: any) => {
    if (!node.oncontextmenu) {
      const _node = node
      // 添加右击事件监听器
      node.oncontextmenu = function (e: any) {
        e.preventDefault() // 阻止默认的右键菜单显示
        debugger
        // 只对标签项本身响应右键（匹配自定义组件的结构）
        const isTabItem = e.target.closest('.tab-item')
        if (!isTabItem) return

        // 获取标签名称（从data-name属性获取，自定义组件中已设置）
        const tabName = _node.dataset.name
        // 排除首页标签
        if (tabName === homeConstantTab.name) return

        // 显示右键菜单
        tabsStore.contextMenuStatus = true
        // 计算菜单位置（适配自定义标签尺寸）
        tabsStore.contextMenuLocationX = _node.getBoundingClientRect().left + (_node.clientWidth - 100) / 2
        tabsStore.contextMenuLocationY = _node.getBoundingClientRect().top + _node.clientHeight + window.scrollY
      }
    }
  })
}

export const rightMenu = (app: any) => {
  /**
   * 全局自定义指令:右键菜单
   * 适配自定义tabs组件，支持标签右键操作
   */
  app.directive('right-menu', {
    mounted(el: any) {
      nextTick(() => {
        menu(el)
      }).catch((err) => console.error('右键菜单初始化失败:', err))
    },
    updated(el: any) {
      nextTick(() => {
        // 清除已有事件监听，避免重复绑定
        const nodes = findAllChildrenWithClass(el, 'tab-item', [])
        nodes.forEach((node: any) => {
          node.oncontextmenu = null
        })
        menu(el)
      }).catch((err) => console.error('右键菜单更新失败:', err))
    },
    unmounted(el: any) {
      // 组件卸载时清理事件
      const nodes = findAllChildrenWithClass(el, 'tab-item', [])
      nodes.forEach((node: any) => {
        node.oncontextmenu = null
      })
    },
  })
}
