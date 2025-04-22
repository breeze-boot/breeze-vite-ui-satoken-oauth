<!--
 * @author: gaoweixuan
 * @since: 2024-03-02
-->

<!-- 字典项添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addDictItem, getDictItem, editDictItem } from '@/api/system/dictItem/index.ts'
import { DictItemForm } from '@/api/system/dictItem/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'DictItemAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const dictItemDataFormRef = ref()
const dictItemDataForm = ref<DictItemForm>({ type: '', label: '', value: '', id: 0 })

let tagTypes = ref([
  { type: 'primary' },
  { type: 'success' },
  { type: 'warning' },
  { type: 'danger' },
  { type: 'info' },
])

const rules = ref({
  label: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('dictItem.fields.label'),
      trigger: 'blur',
    },
  ],
  value: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('dictItem.fields.value'),
      trigger: 'blur',
    },
  ],
  type: [
    {
      required: true,
      message: t('common.placeholder.choose') + t('dictItem.fields.type'),
      trigger: 'change',
    },
  ],
})

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  // 添加的时候传来的是字典项ID
  dictItemDataForm.value.id = undefined
  // 添加的时候传来的是字典ID
  dictItemDataForm.value.dictId = id
  visible.value = true
  // 重置表单数据
  if (dictItemDataFormRef.value) {
    dictItemDataFormRef.value.resetFields()
  }
  if (id) {
    await getInfo(id)
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  try {
    const response: any = await getDictItem(JSONBigInt.parse(id))
    Object.assign(dictItemDataForm.value, response.data)
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 表单提交
 */
const handleDictItemDataFormSubmit = async () => {
  await dictItemDataFormRef.value.validate()
  loading.value = true
  const id = dictItemDataForm.value.id
  try {
    id ? await editDictItem(id, dictItemDataForm.value) : await addDictItem(dictItemDataForm.value)
    useMessage().success(`${(id ? t('common.modify') : t('common.save')) + t('common.success')}`)
    $emit('reloadDataList')
  } catch (err: any) {
    useMessage().error(`${t('common.fail')} ${err.message}`)
  } finally {
    visible.value = false
    loading.value = false
  }
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="!dictItemDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dictItemDataForm"
      :rules="rules"
      ref="dictItemDataFormRef"
      @keyup.enter="handleDictItemDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('dictItem.fields.label')" prop="label">
        <el-input
          v-model="dictItemDataForm.label"
          autocomplete="off"
          clearable
          :placeholder="t('dictItem.fields.label')"
        />
      </el-form-item>
      <el-form-item :label="t('dictItem.fields.value')" prop="value">
        <el-input
          v-model="dictItemDataForm.value"
          autocomplete="off"
          clearable
          :placeholder="t('dictItem.fields.value')"
        />
      </el-form-item>
      <el-form-item :label="t('dictItem.fields.type')" prop="value">
        <el-select
          v-model="dictItemDataForm.type"
          autocomplete="off"
          clearable
          :placeholder="t('dictItem.fields.type')"
          style="width: 240px"
        >
          <el-option v-for="item in tagTypes" :key="item.type" :label="item.type" :value="item.type">
            <div class="flex items-center">
              <el-tag :type="item.type" style="margin-right: 8px" size="small" />
              <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
                {{ item.type }}
              </span>
            </div>
          </el-option>
        </el-select>
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
      <el-button type="primary" :loading="loading" @click="handleDictItemDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
