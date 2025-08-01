<!--
 * @author: gaoweixuan
 * @since: 2024-03-05
-->

<!-- 角色菜单权限修改弹出框 -->
<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElTree } from 'element-plus'
import { listTreePermission } from '@/api/auth/menu'
import { MenuTreeRecord } from '@/api/auth/menu/type.ts'
import { listRolesMenuColumnPermission, saveRoleMenuColumn } from '@/api/auth/permission/menuColumn'
import SvgButton from '@/components/SvgButton/index.vue'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'RolePermissionList',
  inheritAttrs: false,
})

const filterText = ref('')
const treeSetting = reactive({
  expandAll: true,
  checkStrictly: true,
})

const { t } = useI18n()
const $message = useMessage()
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const rolePermissionTreeRef = ref<InstanceType<typeof ElTree>>()
const roleTreeData = ref<MenuTreeRecord[]>([])
const currentClickRoleId = ref<string | number>()

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  visible.value = true
  // 重置表单数据
  if (rolePermissionTreeRef.value) {
    currentClickRoleId.value = undefined
  }
  currentClickRoleId.value = id
  await getInfo(id)
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  try {
    const treePermissionResponse: any = await listTreePermission([0, 1])
    Object.assign(roleTreeData.value, treePermissionResponse.data)
  } catch (err: any) {
    $message.warning(t('common.reloadFail'))
    return
  }

  try {
    const rolesPermissionResponse: any = await listRolesMenuColumnPermission(id)
    const menus = rolesPermissionResponse.data.map((item: any) => item.menu)
    if (menus) {
      rolePermissionTreeRef.value.setCheckedKeys(menus, true)
    }
  } catch (err: any) {
    $message.warning(t('common.reloadFail'))
    console.error(err.message)
  }
}

/**
 * 表单提交
 */
const handleRoleDataFormSubmit = async () => {
  const checkedKeys = rolePermissionTreeRef.value.getCheckedKeys()
  const halfCheckedKeys = rolePermissionTreeRef.value.getHalfCheckedKeys()
  if (halfCheckedKeys.length > 0) {
    checkedKeys.push(...halfCheckedKeys)
  }
  loading.value = true
  try {
    await saveRoleMenuColumn({
      roleId: currentClickRoleId.value as number,
      menu: checkedKeys as string[],
    })
    $message.success(`${t('common.success')}`)
    visible.value = false
    loading.value = false
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
}

watch(filterText, (val) => {
  rolePermissionTreeRef.value!.filter(val)
})

const filterNode = (value: string, data: MenuTreeRecord) => {
  if (!value) return true
  return data.title.includes(value)
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="t('role.common.menuColumnPermission')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="tree-filter-container">
      <el-input class="input-line" v-model="filterText" placeholder="" />
      <svg-button
        :icon="treeSetting.checkStrictly ? 'strictly' : 'strictly'"
        type="default"
        :style="{ margin: '10px 5px' }"
        :label="treeSetting.checkStrictly ? t('common.oneCheck') : t('common.cascadeCheck')"
        @svg-btn-click="() => (treeSetting.checkStrictly = !treeSetting.checkStrictly)"
      />
    </div>
    <el-container class="tree-filter-container tree-container">
      <el-tree
        ref="rolePermissionTreeRef"
        class="filter-tree"
        style="max-width: 600px"
        node-key="name"
        show-checkbox
        :check-strictly="treeSetting.checkStrictly"
        :expand-on-click-node="false"
        :default-expand-all="treeSetting.expandAll"
        highlight-current
        :data="roleTreeData"
        :props="{
          children: 'children',
          label: 'title',
        }"
        empty-text="无数据"
        :filter-node-method="filterNode"
      >
        <template #default="{ node, data }">
          <span v-if="data.type === 1" class="custom-tree-node">
            <span>{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
    </el-container>
    <template #footer>
      <el-button
        @click="
          () => {
            visible = false
            loading = false
          }
        "
      >
        {{ t('common.cancel') }}
      </el-button>
      <el-button
        v-has="['auth:menu:column:permission:modify', 'ROLE_ADMIN']"
        type="primary"
        :loading="loading"
        @click="handleRoleDataFormSubmit()"
      >
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.tree-filter-container {
  display: flex;
  justify-content: flex-start;
  width: 650px;
  margin: 0 auto;

  .input-line {
    width: 250px;
    margin: 10px 0;
  }
}

.tree-container {
  width: auto;
  height: 500px;
  margin: 0 auto;
  overflow-y: scroll;
  border: 1px solid #eee;

  .custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    font-size: 14px;
  }
}
</style>
