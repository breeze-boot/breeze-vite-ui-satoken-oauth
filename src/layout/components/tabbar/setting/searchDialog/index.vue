<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { RouteRecordRaw, useRouter } from 'vue-router'
import useMenuStore from '@/store/modules/menu.ts'
import { useI18n } from 'vue-i18n'
import { MENU_TYPE } from '@/utils/common.ts'

let $router = useRouter()
let menuStore = useMenuStore()
const searchDialog = ref<null | any>()
const routeData = ref<RouteRecordRaw[]>([])
const routeSearch = ref<any>()
const { t } = useI18n()

onMounted(() => {
  routeData.value = loadAll()
})

const handleSelect = async (item: RouteRecordRaw) => {
  await $router.push({ path: item.path })
  searchDialog.value.style.display = 'none'
}

const querySearch = (queryString: string, cb: any) => {
  const results = queryString ? routeData.value.filter(createFilter(queryString)) : routeData.value
  // call callback function to return suggestions
  cb(results)
}
const createFilter = (queryString: string) => {
  return (restaurant: RouteRecordRaw) => {
    return restaurant.meta?.title?.toString().toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

const treeToArray = (tree: any): RouteRecordRaw[] => {
  let result: RouteRecordRaw[] = []

  function traverse(node: RouteRecordRaw, level = 0) {
    let item = { ...node, level }
    if (item?.meta?.type && item?.meta?.type === MENU_TYPE.MENU) {
      result.push(item)
    }

    if (node.children && node.children.length > 0) {
      for (let child of node.children) {
        traverse(child, level + 1)
      }
    }
  }
  for (let node of tree) {
    traverse(node)
  }
  return result
}

const loadAll = (): RouteRecordRaw[] => {
  return treeToArray(menuStore.menuRoutes)
}

const toggleCloseSearch = () => {
  searchDialog.value.style.display = 'none'
}

const toggleOpenSearch = () => {
  searchDialog.value.style.display = 'block'
}
</script>

<template>
  <div ref="searchDialog" @click.stop="toggleCloseSearch" class="dialog_search">
    <div class="search" @click.stop>
      <el-autocomplete
        :fetch-suggestions="querySearch"
        :debounce="100"
        v-model="routeSearch"
        clearable
        class="inline-input"
        :placeholder="t('common.pleasEnterMenuName')"
        @select="handleSelect"
      >
        <template #default="{ item }">
          <div class="link">{{ item.meta?.title }}</div>
        </template>
      </el-autocomplete>
    </div>
  </div>
  <el-button style="margin: 0 5px" circle :icon="Search" @click.stop="toggleOpenSearch" />
</template>

<style lang="scss" scoped>
.dialog_search {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999998;
  display: none;
  width: 100vw;
  height: 100vh;
  background: var(--base-search-dialog-theme);

  .search {
    position: absolute;
    top: 25%;
    left: 50%;
    z-index: 9999999;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
  }
}
</style>

<style lang="scss">
.dialog_search {
  .el-input__inner {
    box-sizing: border-box;
    flex-grow: 1;
    width: 300px !important;
    height: 40px;
    padding: 5px 10px;
    font-size: 20px;
    line-height: 50px;
    color: var(--el-input-text-color, var(--el-text-color-regular));
    background: 0 0;
    border: none;
    outline: 0;
  }
}
</style>
