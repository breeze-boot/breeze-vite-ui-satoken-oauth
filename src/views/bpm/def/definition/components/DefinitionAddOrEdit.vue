<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->

<!-- 流程定义添加修改弹出框 -->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import ProcessDesigner from '@/components/ProcessDesigner/index.vue'
import { deployDefinition, getDefinition } from '@/api/bpm/def/definition'
import { useI18n } from 'vue-i18n'
import type { BpmDefinitionForm } from '@/api/bpm/def/definition/type.ts'
import { SelectData } from '@/types/types.ts'
import { selectCategory } from '@/api/bpm/def/category'
import { ElMessageBox } from 'element-plus'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'DefinitionAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()

const visibleDesigner = ref<boolean>(false)
const categoryOption = ref<SelectData[]>()
const bpmnXml = ref<string>('')
const reloadIndex = ref(0)
const loading = ref<boolean>(false)
const flowDesignerRef = ref(null)
const flowForm = reactive<any>({
  modelId: '',
  procDefName: '',
  procDefKey: '',
})

const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const definitionDataFormRef = ref()
const definitionDataForm = ref<BpmDefinitionForm>({
  procDefName: '',
  procDefKey: '',
  categoryCode: '',
  version: '',
  deploymentTime: '',
  xml: '',
})

const rules = ref({
  categoryCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('definition.fields.categoryCode'),
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
  definitionDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (definitionDataFormRef.value) {
    bpmnXml.value = ''
    definitionDataFormRef.value.resetFields()
  }
  await initCategory()
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
  const response: any = await getDefinition(id)
  if (response.code === '0000') {
    Object.assign(definitionDataForm.value, response.data)
    bpmnXml.value = response.data.xml
  }
}

/**
 * 显示设计器
 */
const handleShowDesigner = () => {
  definitionDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    flowForm.modelId = definitionDataForm.value.id
    flowForm.procDefKey = definitionDataForm.value.procDefKey
    flowForm.procDefName = definitionDataForm.value.procDefName
    reloadIndex.value = Math.random()
    visibleDesigner.value = true
  })
}

const onSaveDesigner = async (xml: string, procDefKey: string, procDefName: string) => {
  ElMessageBox.confirm(t('definition.confirmMsg'), '', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      bpmnXml.value = xml
      visibleDesigner.value = false
      definitionDataForm.value.xml = xml
      definitionDataForm.value.procDefKey = procDefKey
      definitionDataForm.value.procDefName = procDefName
    })
    .catch(() => {
      useMessage().info(`${t('common.cancel')}`)
    })
}

/**
 * 初始化流程分类下拉框
 */
const initCategory = async () => {
  try {
    const response: any = await selectCategory()
    categoryOption.value = response.data
  } catch (err: any) {
    console.error(err.message)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = async () => {
  await definitionDataFormRef.value.validate()
  try {
    await deployDefinition(definitionDataForm.value)
    useMessage().success(`${t('common.success')}`)
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
  <el-dialog v-model="visible" :title="t('common.design')" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form
      :model="definitionDataForm"
      :rules="rules"
      ref="definitionDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="95px"
    >
      <el-form-item :label="t('definition.fields.procDefName')" prop="procDefName">
        <el-input
          disabled
          v-model="definitionDataForm.procDefName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('definition.fields.procDefName')"
        />
      </el-form-item>
      <el-form-item :label="t('definition.fields.procDefKey')" prop="procDefKey">
        <el-input
          disabled
          v-model="definitionDataForm.procDefKey"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('definition.fields.procDefKey')"
        />
      </el-form-item>
      <el-form-item :label="t('category.fields.categoryCode')" prop="categoryCode">
        <el-select
          v-model="definitionDataForm.categoryCode"
          collapse-tags
          filterable
          clearable
          :placeholder="t('common.placeholder.choose') + t('definition.fields.categoryCode')"
        >
          <el-option
            v-for="item in categoryOption"
            :key="item.value"
            :label="item.label"
            :value="item.value.valueOf()"
          />
        </el-select>
      </el-form-item>
      <el-form-item label-width="110px">
        <el-button style="width: 100%" @click="handleShowDesigner">
          {{ t('common.nextStep') }}
        </el-button>
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
      <el-button type="primary" :loading="loading" @click="handleDataFormSubmit()">{{ t('common.confirm') }}</el-button>
    </template>
  </el-dialog>

  <process-designer
    :key="`designer-${reloadIndex}`"
    ref="flowDesignerRef"
    :show="visibleDesigner"
    :flow-form="flowForm"
    :bpmn-xml="bpmnXml"
    @save="onSaveDesigner"
  />
</template>
