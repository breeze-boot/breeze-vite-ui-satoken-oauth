<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 菜单添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addMenu, editMenu, getMenu, selectMenu } from '@/api/auth/menu'
import { MenuForm } from '@/api/auth/menu/type.ts'
import { useI18n } from 'vue-i18n'
import { SelectData } from '@/types/types.ts'
import { useDict } from '@/hooks/dict'
import { DIALOG_FLAG, ROOT } from '@/utils/common.ts'
import SvgIconSelect from '@/components/SvgIconSelect/index.vue'
import JSONBigInt from 'json-bigint'
import { selectPlatform } from '@/api/auth/platform'

defineOptions({
  name: 'MenuAddOrEdit',
  inheritAttrs: false,
})

const { KEEPALIVE, HIDDEN, HREF, MENU_TYPE } = useDict('KEEPALIVE', 'HIDDEN', 'HREF', 'MENU_TYPE')
const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const platformOptions = ref<SelectData[]>()
const menuOptions = ref<SelectData[]>()
const menuDataFormRef = ref()
const menuDataForm = ref<MenuForm>({ hidden: 0, href: 0, keepAlive: 0, sort: 0, type: 0 })

const rules = ref({
  platformId: [
    {
      required: true,
      message: t('menu.rules.platformId'),
      trigger: 'change',
    },
  ],
  name: [
    {
      required: true,
      message: t('menu.rules.name'),
      trigger: 'blur',
    },
  ],
  title: [
    {
      required: true,
      message: t('menu.rules.title'),
      trigger: 'blur',
    },
  ],
  permission: [
    {
      required: false,
      message: t('menu.rules.permission'),
      trigger: 'blur',
    },
  ],
  path: [
    {
      required: true,
      message: t('menu.rules.path'),
      trigger: 'blur',
    },
  ],
  component: [
    {
      required: true,
      message: t('menu.rules.component'),
      trigger: 'blur',
    },
  ],
})

/**
 * 初始化
 *
 * @param id
 * @param flag
 */
const init = async (id: number, flag: DIALOG_FLAG) => {
  menuDataForm.value.id = undefined
  menuDataForm.value.parentId = undefined
  visible.value = true
  // 重置表单数据
  if (menuDataFormRef.value) {
    menuDataFormRef.value.resetFields()
  }
  await initSelectPlatform()
  if (flag === DIALOG_FLAG.ADD) {
    // 添加，都可以选择
    menuDataForm.value.parentId = ROOT.value as number
    await initSelectMenu(undefined)
  }

  if (flag === DIALOG_FLAG.ADD_SUB) {
    // 添加子节点，赋值父节点为当前节点
    await initSelectMenu(id)
    menuDataForm.value.parentId = id
  }

  if (flag === DIALOG_FLAG.EDIT && id) {
    // 修改/添加子节点
    // 不可选择本节点
    await initSelectMenu(id)
    await getInfo(id)
  }
}

/**
 * 初始化菜单下拉框数据
 */
const initSelectMenu = async (id: number | undefined) => {
  const response: any = await selectMenu(JSONBigInt.parse(id || 0))
  // 修改上级菜单不能为当前节点
  if (response.code === '0000') {
    menuOptions.value = [
      {
        value: ROOT.value,
        label: ROOT.label,
        children: response.data,
      },
    ]
  }
}

/**
 * 初始化平台下拉框数据
 */
const initSelectPlatform = async () => {
  const response: any = await selectPlatform()
  if (response.code === '0000') {
    platformOptions.value = response.data
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  const response: any = await getMenu(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(menuDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleMenuDataFormSubmit = () => {
  menuDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = menuDataForm.value.id
    if (id) {
      await editMenu(id, menuDataForm.value)
      ElMessage.success({
        message: t('common.success'),
        duration: 1000,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addMenu(menuDataForm.value)
      ElMessage.success({
        message: t('common.success'),
        duration: 1000,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    }
  })
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    width="38%"
    :title="!menuDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="menuDataForm"
      :rules="rules"
      ref="menuDataFormRef"
      @keyup.enter="handleMenuDataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label-width="100px" :label="t('menu.fields.platformId')" prop="platformId" style="text-align: left">
        <el-select v-model="menuDataForm.platformId" :placeholder="t('menu.fields.platformId')">
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="100px" :label="t('menu.fields.type')" style="text-align: left" prop="type">
        <el-radio-group v-model="menuDataForm.type">
          <el-radio-button v-for="item in MENU_TYPE" :key="item.value" :value="Number(item.value)">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="menuDataForm.type === 1"
        label-width="100px"
        :label="t('menu.fields.href')"
        style="text-align: left"
        prop="href"
      >
        <el-radio-group v-model="menuDataForm.href">
          <el-radio-button v-for="item in HREF" :key="item.value" :value="Number(item.value)">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="menuDataForm.type === 1"
        label-width="100px"
        :label="t('menu.fields.keepAlive')"
        style="text-align: left"
        prop="keepAlive"
      >
        <el-radio-group v-model="menuDataForm.keepAlive">
          <el-radio-button v-for="item in KEEPALIVE" :key="item.value" :value="Number(item.value)">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="menuDataForm.type === 1"
        label-width="100px"
        :label="t('menu.fields.hidden')"
        style="text-align: left"
        prop="hidden"
      >
        <el-radio-group v-model="menuDataForm.hidden">
          <el-radio-button v-for="item in HIDDEN" :key="item.value" :value="Number(item.value)">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label-width="100px" class="parentId" :label="t('menu.fields.parentMenu')" prop="parentId">
        <el-cascader
          v-model="menuDataForm.parentId"
          :options="menuOptions"
          :props="{ checkStrictly: true, emitPath: false, value: 'value', label: 'label' }"
          :show-all-levels="false"
          clearable
          filterable
        ></el-cascader>
      </el-form-item>

      <el-form-item label-width="100px" :label="t('menu.fields.sort')" prop="sort" style="text-align: left">
        <el-input-number v-model="menuDataForm.sort" :min="1" :step="1" />
      </el-form-item>

      <el-form-item label-width="100px" :label="t('menu.fields.title')" prop="title">
        <el-input v-model="menuDataForm.title" autocomplete="off" clearable :placeholder="t('menu.fields.title')" />
      </el-form-item>

      <el-form-item
        v-if="menuDataForm.type === 0 || menuDataForm.type === 1"
        label-width="100px"
        :label="t('menu.fields.icon')"
        prop="icon"
      >
        <svg-icon-select :placeholder="t('menu.fields.icon')" v-model="menuDataForm.icon" />
      </el-form-item>

      <el-form-item
        v-if="menuDataForm.type === 0 || menuDataForm.type === 1"
        label-width="100px"
        :label="t('menu.fields.path')"
        prop="path"
      >
        <el-input v-model="menuDataForm.path" autocomplete="off" clearable :placeholder="t('menu.fields.path')" />
      </el-form-item>

      <el-form-item
        v-if="menuDataForm.href === 0 && menuDataForm.type === 1"
        label-width="100px"
        :label="t('menu.fields.name')"
        prop="name"
      >
        <el-input v-model="menuDataForm.name" autocomplete="off" clearable :placeholder="t('menu.fields.name')" />
      </el-form-item>

      <el-form-item
        v-if="menuDataForm.href === 0 && menuDataForm.type === 1"
        label-width="100px"
        :label="t('menu.fields.component')"
        prop="component"
      >
        <el-input
          v-model="menuDataForm.component"
          autocomplete="off"
          clearable
          :placeholder="t('menu.fields.component')"
        >
          <template #prepend>src/views</template>

          <template #append>.vue</template>
        </el-input>
      </el-form-item>

      <el-form-item
        v-if="menuDataForm.type === 1 || menuDataForm.type === 2"
        label-width="100px"
        :label="t('menu.fields.permission')"
        prop="permission"
      >
        <el-input
          v-model="menuDataForm.permission"
          autocomplete="off"
          clearable
          :placeholder="t('menu.fields.permission')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleMenuDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
