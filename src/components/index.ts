/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import type { App, Component } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import BTable from '@/components/Table/BTable/index.vue'
import TableItem from '@/components/Table/TableItem/TableItem.vue'
import BTreeTable from '@/components/Table/BTreeTable/index.vue'
import SvgButton from '@/components//SvgButton/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import AvatarUpload from '@/components/Upload/AvatarUpload/index.vue'

const components: { [name: string]: Component } = {
  SvgIcon,
  BTable,
  BTreeTable,
  SearchContainerBox,
  SvgButton,
  TableItem,
  AvatarUpload,
}

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
