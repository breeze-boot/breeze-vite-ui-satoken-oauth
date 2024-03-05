<!--
 * @author: gaoweixuan
 * @since: 2024-03-05
-->

<!-- 角色添加修改弹出框 -->
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
  defaultExpandAll: true,
  checkStrictly: false,
})

const defaultProps = {
  children: 'children',
  label: 'title',
}

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
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
  const treePermissionResponse: any = await listTreePermission()
  if (treePermissionResponse.code !== '0000') {
    ElMessage.warning({
      message: t('common.reloadFail'),
      duration: 500,
    })
    return
  }
  Object.assign(roleTreeData.value, treePermissionResponse.data)
  const rolesPermissionResponse: any = await listRolesPermission(id)
  if (rolesPermissionResponse.code !== '0000') {
    ElMessage.warning({
      message: t('common.reloadFail'),
      duration: 500,
    })
    return
  }
  const menuIds = rolesPermissionResponse.data.map((item: any) => item.menuId)
  rolePermissionTreeRef.value!.setCheckedKeys(menuIds, true)
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
  if (checkedKeys.length <= 0) {
    ElMessage.warning({
      message: t('role.common.rolePermission'),
      duration: 500,
    })
    return
  }
  await modifyPermission({
    roleId: currentClickRoleId.value,
    permissionIds: checkedKeys,
  })
  ElMessage.success({
    message: t('common.success'),
    duration: 500,
    onClose: () => {
      visible.value = false
      $emit('reloadDataList')
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
    :title="t('common.rolePermission')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-row>
      <el-col :span="10">
        <el-input v-model="filterText" style="margin: 10px 0; width: 240px" placeholder="Filter keyword" />
      </el-col>
      <el-col :span="14">
        <el-button
          :type="treeSetting.checkStrictly ? 'primary' : 'default'"
          style="margin: 10px 5px"
          @click="() => (treeSetting.checkStrictly = !treeSetting.checkStrictly)"
        >
          级联勾选
        </el-button>
      </el-col>
    </el-row>

    <el-tree
      ref="rolePermissionTreeRef"
      class="filter-tree"
      style="max-width: 600px"
      node-key="id"
      show-checkbox
      :check-strictly="treeSetting.checkStrictly"
      :default-expand-all="treeSetting.defaultExpandAll"
      highlight-current
      :data="roleTreeData"
      :props="defaultProps"
      empty-text="无数据"
      :filter-node-method="filterNode"
    />
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleRoleDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
