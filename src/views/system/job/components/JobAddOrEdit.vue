<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 任务添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addJob, getJob, editJob } from '@/api/system/job'
import { JobRecord } from '@/api/system/job/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useDict } from '@/hooks/dict'

defineOptions({
  name: 'JobAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const { JOB_GROUP, MISFIRE_POLICY } = useDict('JOB_GROUP', 'MISFIRE_POLICY')
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const jobDataFormRef = ref()
const jobDataForm = ref<JobRecord>({
  concurrent: 0,
  misfirePolicy: -1,
  status: 0,
})

const rules = ref({
  jobName: [
    {
      required: true,
      message: t('job.rules.jobName'),
      trigger: 'blur',
    },
  ],
  jobGroupName: [
    {
      required: true,
      message: t('job.rules.jobGroupName'),
      trigger: 'change',
    },
  ],
  clazzName: [
    {
      required: true,
      message: t('job.rules.clazzName'),
      trigger: 'blur',
    },
  ],
  cronExpression: [
    {
      required: true,
      message: t('job.rules.cronExpression'),
      trigger: 'blur',
    },
  ],
})

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  jobDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (jobDataFormRef.value) {
    jobDataFormRef.value.resetFields()
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
  const response: any = await getJob(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(jobDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleJobDataFormSubmit = () => {
  jobDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    const id = jobDataForm.value.id
    if (id) {
      await editJob(jobDataForm.value)
      ElMessage.success({
        message: `${t('common.modify') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addJob(jobDataForm.value)
      ElMessage.success({
        message: `${t('common.save') + t('common.success')}`,
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
    :title="!jobDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="jobDataForm"
      :rules="rules"
      ref="jobDataFormRef"
      @keyup.enter="handleJobDataFormSubmit()"
      label-width="125px"
    >
      <el-form-item label-width="125px" :label="$t('job.fields.jobName')" prop="jobName">
        <el-input v-model="jobDataForm.jobName" autocomplete="off" clearable :placeholder="$t('job.fields.jobName')" />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('job.fields.jobGroupName')" prop="jobGroupName">
        <el-select
          v-model="jobDataForm.jobGroupName"
          collapse-tags
          filterable
          :placeholder="$t('job.fields.jobGroupName')"
        >
          <el-option v-for="item in JOB_GROUP" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('job.fields.cronExpression')" prop="cronExpression">
        <cron-select v-model="jobDataForm.cronExpression" :placeholder="$t('job.fields.cronExpression')" />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('job.fields.clazzName')" prop="clazzName">
        <el-input
          v-model="jobDataForm.clazzName"
          autocomplete="off"
          clearable
          :placeholder="$t('job.fields.clazzName')"
        />
        <span style="color: rgba(189, 38, 38, 0.85); font-size: 0.6rem; margin-top: 6px">
          ** 请设置执行方法【全类名.方法名('string',1, true, 1D, 1L)】或【Bean名.方法名('string',1, true, 1D, 1L)】
        </span>
      </el-form-item>

      <el-form-item label-width="125px" :label="$t('job.fields.misfirePolicy')" prop="misfirePolicy">
        <el-radio-group v-model="jobDataForm.misfirePolicy">
          <el-radio v-for="item in MISFIRE_POLICY" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('job.fields.concurrent')" prop="concurrent">
        <el-switch
          v-model="jobDataForm.concurrent"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#AAAAAA"
        ></el-switch>
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('job.fields.status')" prop="status">
        <el-switch
          v-model="jobDataForm.status"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#AAAAAA"
        ></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleJobDataFormSubmit()">{{ t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
