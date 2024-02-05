/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import SvgIcon from './SvgIcon/index.vue'
import BTable from './Table/index.vue'
import ButtonSvgIcon from './Table/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import type { App, Component } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const components: { [name: string]: Component } = { SvgIcon, BTable, SearchContainerBox, ButtonSvgIcon }

export default {
  install(app: App) {
    /**
     * 自定义组件注册
     */
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key])
    })

    /**
     * 注册el-icon
     */
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
