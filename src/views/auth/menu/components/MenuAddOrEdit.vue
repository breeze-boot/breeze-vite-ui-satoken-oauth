<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 菜单添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addMenu, editMenu, getMenu, selectMenu } from '@/api/auth/menu'
import { MenuForm } from '@/api/auth/menu/type.ts'
import { useI18n } from 'vue-i18n'
import { SelectData } from '@/types/types.ts'
import { useDict } from '@/hooks/dict'
import { DIALOG_FLAG, ROOT } from '@/utils/common.ts'
import SvgIconSelect from '@/components/SvgIconSelect/index.vue'
import JSONBigInt from 'json-bigint'
import { selectPlatform } from '@/api/auth/platform'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'MenuAddOrEdit',
  inheritAttrs: false,
})

const { KEEPALIVE, HIDDEN, HREF, MENU_TYPE } = useDict('KEEPALIVE', 'HIDDEN', 'HREF', 'MENU_TYPE')
const { t } = useI18n()
const $message = useMessage()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const platformOptions = ref<SelectData[]>()
const menuOptions = ref<SelectData[]>()
const menuDataFormRef = ref()
const menuDataForm = ref<MenuForm>({ hidden: 0, href: 0, keepAlive: 0, sort: 0, type: 0 })

const rules = ref({
  platformId: [
    {
      required: true,
      message: t('common.placeholder.choose') + t('menu.fields.platformId'),
      trigger: 'change',
    },
  ],
  name: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('menu.fields.name'),
      trigger: 'blur',
    },
  ],
  title: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('menu.fields.title'),
      trigger: 'blur',
    },
  ],
  permission: [
    {
      required: false,
      message: t('common.placeholder.enter') + t('menu.fields.permission'),
      trigger: 'blur',
    },
  ],
  path: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('menu.fields.path'),
      trigger: 'blur',
    },
  ],
  component: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('menu.fields.component'),
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
  try {
    const response: any = await selectMenu(JSONBigInt.parse(id || 0))
    menuOptions.value = [
      {
        value: ROOT.value,
        label: ROOT.label,
        children: response.data,
      },
    ]
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 初始化平台下拉框数据
 */
const initSelectPlatform = async () => {
  try {
    const response: any = await selectPlatform()
    platformOptions.value = response.data
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  try {
    const response: any = await getMenu(JSONBigInt.parse(id))
    Object.assign(menuDataForm.value, response.data)
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 表单提交
 */
const handleMenuDataFormSubmit = async () => {
  await menuDataFormRef.value.validate()
  loading.value = true
  const id = menuDataForm.value.id
  try {
    id ? await editMenu(id, menuDataForm.value) : await addMenu(menuDataForm.value)
    $message.success(`${(id ? t('common.modify') : t('common.save')) + t('common.success')}`)
    $emit('reloadDataList')
    visible.value = false
    loading.value = false
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="!menuDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="menuDataForm"
      :rules="rules"
      ref="menuDataFormRef"
      @keyup.enter="handleMenuDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('menu.fields.platformId')" prop="platformId" style="text-align: left">
        <el-select
          v-model="menuDataForm.platformId"
          :placeholder="t('common.placeholder.choose') + t('menu.fields.platformId')"
        >
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('menu.fields.type')" style="text-align: left" prop="type">
        <el-radio-group v-model="menuDataForm.type">
          <el-radio-button v-for="item in MENU_TYPE" :key="item.value" :value="Number(item.value)">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="menuDataForm.type === 1" :label="t('menu.fields.href')" style="text-align: left" prop="href">
        <el-radio-group v-model="menuDataForm.href">
          <el-radio-button v-for="item in HREF" :key="item.value" :value="Number(item.value)">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="menuDataForm.type === 1"
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

      <el-form-item class="parentId" :label="t('menu.fields.parentMenu')" prop="parentId">
        <el-cascader
          v-model="menuDataForm.parentId"
          :options="menuOptions"
          :props="{ checkStrictly: true, emitPath: false, value: 'value', label: 'label' }"
          :show-all-levels="false"
          clearable
          filterable
        ></el-cascader>
      </el-form-item>

      <el-form-item :label="t('menu.fields.sort')" prop="sort" style="text-align: left">
        <el-input-number v-model="menuDataForm.sort" :min="1" :step="1" />
      </el-form-item>

      <el-form-item :label="t('menu.fields.title')" prop="title">
        <el-input
          v-model="menuDataForm.title"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('menu.fields.title')"
        />
      </el-form-item>

      <el-form-item
        v-if="menuDataForm.type === 0 || menuDataForm.type === 1"
        :label="t('menu.fields.icon')"
        prop="icon"
      >
        <svg-icon-select
          :placeholder="t('common.placeholder.choose') + t('menu.fields.icon')"
          v-model="menuDataForm.icon"
        />
      </el-form-item>

      <el-form-item
        v-if="menuDataForm.type === 0 || menuDataForm.type === 1"
        :label="t('menu.fields.path')"
        prop="path"
      >
        <el-input
          v-model="menuDataForm.path"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('menu.fields.path')"
        />
      </el-form-item>

      <el-form-item
        v-if="menuDataForm.href === 0 && menuDataForm.type === 1"
        :label="t('menu.fields.name')"
        prop="name"
      >
        <el-input
          v-model="menuDataForm.name"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('menu.fields.name')"
        />
      </el-form-item>

      <el-form-item
        v-if="menuDataForm.href === 0 && menuDataForm.type === 1"
        :label="t('menu.fields.component')"
        prop="component"
      >
        <el-input
          v-model="menuDataForm.component"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('menu.fields.component')"
        >
          <template #prepend>src/views</template>
          <template #append>.vue</template>
        </el-input>
      </el-form-item>

      <el-form-item
        v-if="menuDataForm.type === 1 || menuDataForm.type === 2"
        :label="t('menu.fields.permission')"
        prop="permission"
      >
        <el-input
          v-model="menuDataForm.permission"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('menu.fields.permission')"
        />
      </el-form-item>
    </el-form>
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
      <el-button type="primary" :loading="loading" @click="handleMenuDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
