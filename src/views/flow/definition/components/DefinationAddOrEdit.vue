<!--
 * @author: gaoweixuan
 * @since: 2023-02-25
-->

<!-- 流程定义添加修改弹出框 -->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import ProcessDesigner from '@/components/ProcessDesigner/index.vue'
import { deployDefinition, getDefinition } from '@/api/flow/definition'
import { useI18n } from 'vue-i18n'
import type { FlowDefinitionParam } from '@/api/flow/definition/type.ts'
import { SelectData } from '@/types/types.ts'
import { selectCategory } from '@/api/flow/category'
import { ElMessage, ElMessageBox } from 'element-plus'
import useUserStore from '@/store/modules/user.ts'

defineOptions({
  name: 'DefinitionAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()

const visibleDesigner = ref<boolean>(false)
const categoryOption = ref<SelectData[]>()
const bpmnXml = ref<string>('')
const reloadIndex = ref(0)
const designerLoading = ref(false)
const flowDesignerRef = ref(null)
const flowForm = reactive<any>({
  modelId: '',
  definitionName: '',
  definitionKey: '',
})

const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const definitionDataFormRef = ref()
const definitionDataForm = ref<FlowDefinitionParam>({
  definitionKey: '',
  definitionName: '',
  categoryCode: '',
  version: '',
  deploymentTime: '',
  tenantId: '',
  xml: '',
})

const rules = ref({
  definitionName: [
    {
      required: true,
      message: t('definition.rules.definitionName'),
      trigger: 'blur',
    },
    {
      pattern: /^(?!\\d)[\\da-zA-Z\u4e00-\u9fff]*$/,
      message: t('definition.rules.definitionNameCannotStartWithNumber'),
      trigger: 'blur',
    },
  ],
  definitionKey: [
    {
      required: true,
      message: t('definition.rules.definitionKey'),
      trigger: 'blur',
    },
    {
      pattern: /^(?![0-9])[A-Za-z0-9]+$/,
      message: t('definition.rules.definitionKeyCannotStartWithNumber'),
      trigger: 'blur',
    },
  ],
  categoryCode: [
    {
      required: true,
      message: t('definition.rules.categoryCode'),
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
    flowForm.definitionKey = definitionDataForm.value.definitionKey
    flowForm.definitionName = definitionDataForm.value.definitionName
    reloadIndex.value = Math.random()
    visibleDesigner.value = true
  })
}

const onSaveDesigner = async (xml: string) => {
  ElMessageBox.confirm(t('definition.confirmMsg'), '', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      bpmnXml.value = xml
      visibleDesigner.value = false
      definitionDataForm.value.xml = xml
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: t('common.cancel'),
      })
    })
}

/**
 * 初始化流程分类下拉框
 */
const initCategory = async () => {
  const response: any = await selectCategory()
  if (response.code === '0000') {
    categoryOption.value = response.data
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = () => {
  definitionDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    definitionDataForm.value.tenantId = useUserStore().userInfo.tenantId.toString()
    await deployDefinition(definitionDataForm.value)
    ElMessage.success({
      message: t('common.success'),
      duration: 500,
      onClose: () => {
        visible.value = false
        $emit('reloadDataList')
      },
    })
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
    :title="t('common.design')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="definitionDataForm"
      :rules="rules"
      ref="definitionDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label-width="110px" :label="t('definition.fields.definitionName')" prop="definitionName">
        <el-input v-model="definitionDataForm.definitionName" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="110px" :label="t('definition.fields.definitionKey')" prop="definitionKey">
        <el-input v-model="definitionDataForm.definitionKey" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="110px" :label="t('category.fields.categoryCode')" prop="categoryCode">
        <el-select
          v-model="definitionDataForm.categoryCode"
          collapse-tags
          filterable
          :placeholder="$t('category.fields.categoryCode')"
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
          {{ $t('common.nextStep') }}
        </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>

  <process-designer
    :key="`designer-${reloadIndex}`"
    ref="flowDesignerRef"
    v-loading="designerLoading"
    :show="visibleDesigner"
    :flow-form="flowForm"
    :bpmn-xml="bpmnXml"
    @save="onSaveDesigner"
  />
</template>
