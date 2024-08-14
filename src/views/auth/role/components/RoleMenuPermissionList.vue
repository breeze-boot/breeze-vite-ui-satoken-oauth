<!--
 * @author: gaoweixuan
 * @since: 2024-03-05
-->

<!-- 角色菜单权限修改弹出框 -->
<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { listRolesPermission, modifyPermission } from '@/api/auth/role'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElTree } from 'element-plus'
import { listTreePermission } from '@/api/auth/menu'
import { MenuTreeRecord } from '@/api/auth/menu/type.ts'

defineOptions({
  name: 'RolePermissionList',
  inheritAttrs: false,
})
const filterText = ref('')
const treeSetting = reactive({
  expandAll: true,
  checkStrictly: true,
})

const defaultProps = {
  children: 'children',
  label: 'title',
}

const { t } = useI18n()
const visible = ref(false)
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
  const treePermissionResponse: any = await listTreePermission([0, 1, 2])
  if (treePermissionResponse.code !== '0000') {
    ElMessage.warning({
      message: t('common.reloadFail'),
      duration: 1000,
    })
    return
  }
  Object.assign(roleTreeData.value, treePermissionResponse.data)
  const rolesPermissionResponse: any = await listRolesPermission(id)
  if (rolesPermissionResponse.code !== '0000') {
    ElMessage.warning({
      message: t('common.reloadFail'),
      duration: 1000,
    })
    return
  }
  const menuIds = rolesPermissionResponse.data.map((item: any) => item.menuId)
  if (menuIds) {
    rolePermissionTreeRef.value.setCheckedKeys(menuIds, true)
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
  await modifyPermission({
    roleId: currentClickRoleId.value,
    permissionIds: checkedKeys,
  })
  ElMessage.success({
    message: `${t('common.modify') + t('common.success')}`,
    duration: 1000,
    onClose: () => {
      visible.value = false
    },
  })
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
    width="38%"
    :title="t('role.common.menuPermission')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="tree-filter-container">
      <div class="input-line">
        <el-input v-model="filterText" placeholder="Filter keyword" />
      </div>
      <div>
        <svg-button
          icon="strictly"
          type="default"
          :style="{ margin: '10px 5px' }"
          :circle="false"
          :label="treeSetting.checkStrictly ? t('role.common.oneCheck') : t('role.common.cascadeCheck')"
          @svg-btn-click="() => (treeSetting.checkStrictly = !treeSetting.checkStrictly)"
        />
      </div>
    </div>
    <el-container class="tree-filter-container tree-container">
      <el-tree
        ref="rolePermissionTreeRef"
        class="filter-tree"
        style="max-width: 600px"
        node-key="id"
        show-checkbox
        :check-strictly="treeSetting.checkStrictly"
        :expand-on-click-node="false"
        :default-expand-all="treeSetting.expandAll"
        highlight-current
        :data="roleTreeData"
        :props="defaultProps"
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
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button
        v-has="['auth:menu:permission:modify', 'ROLE_ADMIN']"
        type="primary"
        @click="handleRoleDataFormSubmit()"
      >
        {{ $t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.tree-filter-container {
  width: 650px;
  display: flex;
  justify-content: flex-start;
  margin: 0 auto;

  .input-line {
    width: 250px;
    margin: 10px 0;
  }
}

.tree-container {
  margin: 0 auto;
  height: 500px;
  overflow-y: scroll;

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
