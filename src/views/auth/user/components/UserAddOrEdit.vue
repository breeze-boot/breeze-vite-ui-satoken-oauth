<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 用户添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addUser, getUser, editUser, selectDept, checkUsername, selectRole, selectPost } from '@/api/auth/user'
import { UserRecord } from '@/api/auth/user/type.ts'
import { useI18n } from 'vue-i18n'
import { SelectResponseData } from '@/types/types.ts'
import JSONBigInt from 'json-bigint'

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const deptOption = ref<SelectResponseData[]>()
const roleOption = ref<SelectResponseData[]>()
const postOption = ref<SelectResponseData[]>()
const userDataFormRef = ref()
const userDataForm = ref<UserRecord>({})
const rules = ref({
  username: [
    {
      required: true,
      message: t('user.rules.username'),
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        checkUsername(value, !userDataForm.value.id ? undefined : JSONBigInt.parse(userDataForm.value.id)).then(
          (response: any) => {
            if (response.data) {
              callback()
              return
            }
            callback(new Error(t('user.rules.usernameExists')))
          },
        )
      },
      trigger: 'blur',
    },
  ],
  userCode: [
    {
      required: true,
      message: t('user.rules.userCode'),
      trigger: 'blur',
    },
  ],
  phone: [
    {
      required: true,
      message: t('user.rules.phone'),
      trigger: 'blur',
    },
  ],
  postId: [
    {
      required: true,
      message: t('user.rules.postId'),
      trigger: 'change',
    },
  ],
  deptId: [
    {
      required: true,
      message: t('user.rules.deptId'),
      trigger: 'change',
    },
  ],
  roleIds: [
    {
      required: true,
      message: t('user.rules.roleIds'),
      trigger: 'change',
    },
  ],
  sex: [
    {
      required: true,
      message: t('user.rules.sex'),
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error(t('user.rules.password')))
        } else {
          if (userDataForm.value.confirmPassword !== '') {
            userDataFormRef.value.validateField('confirmPassword')
          }
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error(t('user.rules.passwordAgain')))
        } else if (value !== userDataForm.value.password) {
          callback(new Error(t('user.rules.passwordUnanimous')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      message: t('user.rules.email'),
      trigger: 'blur',
    },
  ],
  idCard: [
    {
      required: true,
      message: t('user.rules.idCard'),
      trigger: 'blur',
    },
  ],
  amountName: [
    {
      required: true,
      message: t('user.rules.amountName'),
      trigger: 'blur',
    },
  ],
})

const init = async (id: number) => {
  visible.value = true
  userDataForm.value.id = undefined
  // 重置表单数据
  if (userDataFormRef.value) {
    userDataFormRef.value.resetFields()
  }
  await initSelectDept()
  await initSelectPost()
  await initSelectRole()
  if (id) {
    await getInfo(id)
  }
}

/**
 * 初始化岗位下拉框数据
 */
const initSelectPost = async () => {
  const response: any = await selectPost()
  if (response.code === '0000') {
    postOption.value = response.data
  }
}

/**
 * 初始化角色下拉框数据
 */
const initSelectRole = async () => {
  const response: any = await selectRole()
  if (response.code === '0000') {
    roleOption.value = response.data
  }
}

/**
 * 初始化部门下拉框数据
 */
const initSelectDept = async () => {
  const response: any = await selectDept()
  if (response.code === '0000') {
    deptOption.value = response.data
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  const response: any = await getUser(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(userDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleUserDataFormSubmit = () => {
  userDataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    const bankId = userDataForm.value.id
    if (bankId) {
      editUser(userDataForm.value)
        .then(() => {
          ElMessage.success({
            message: t('common.success'),
            duration: 500,
            onClose: () => {
              visible.value = false
              $emit('reloadDataList')
            },
          })
        })
        .finally(() => {})
    } else {
      addUser(userDataForm.value)
        .then(() => {
          ElMessage.success({
            message: t('common.success'),
            duration: 500,
            onClose: () => {
              visible.value = false
              $emit('reloadDataList')
            },
          })
        })
        .finally(() => {})
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
    :title="!userDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="userDataForm"
      :rules="rules"
      ref="userDataFormRef"
      @keyup.enter="handleUserDataFormSubmit()"
      label-width="125px"
    >
      <el-form-item style="text-align: center"></el-form-item>
      <el-form-item label-width="125px" :label="$t('user.fields.username')" prop="username">
        <el-input
          v-model="userDataForm.username"
          autocomplete="off"
          clearable
          :placeholder="$t('user.fields.username')"
        />
      </el-form-item>
      <el-form-item v-if="!userDataForm.id" label-width="125px" :label="$t('user.fields.password')" prop="password">
        <el-input
          v-model="userDataForm.password"
          autocomplete="off"
          clearable
          show-password
          type="password"
          :placeholder="$t('user.fields.password')"
        />
      </el-form-item>
      <el-form-item
        v-if="!userDataForm.id"
        label-width="125px"
        :label="$t('user.fields.confirmPassword')"
        prop="confirmPassword"
      >
        <el-input
          v-model="userDataForm.confirmPassword"
          autocomplete="off"
          clearable
          show-password
          type="password"
          :placeholder="$t('user.fields.confirmPassword')"
        />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('user.fields.userCode')" prop="userCode">
        <el-input
          v-model="userDataForm.userCode"
          autocomplete="off"
          clearable
          :placeholder="$t('user.fields.userCode')"
        />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('user.fields.phone')" prop="phone">
        <el-input v-model="userDataForm.phone" autocomplete="off" clearable :placeholder="$t('user.fields.phone')" />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('user.fields.email')" prop="email">
        <el-input v-model="userDataForm.email" autocomplete="off" clearable :placeholder="$t('user.fields.email')" />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('user.fields.amountName')" prop="amountName">
        <el-input
          v-model="userDataForm.amountName"
          autocomplete="off"
          clearable
          :placeholder="$t('user.fields.amountName')"
        />
      </el-form-item>
      <el-form-item label-width="125px" class="dept" :label="$t('user.fields.dept')" prop="deptId">
        <el-cascader
          tag-type="info"
          v-model="userDataForm.deptId"
          :options="deptOption"
          :props="{ checkStrictly: true, emitPath: false, value: 'value', label: 'label' }"
          :show-all-levels="false"
          clearable
          filterable
          :placeholder="$t('user.fields.dept')"
        />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('user.fields.post')" style="text-align: left" prop="postId">
        <el-select v-model="userDataForm.postId" collapse-tags filterable :placeholder="$t('user.fields.post')">
          <el-option v-for="item in postOption" :key="item.value" :label="item.label" :value="item.value.valueOf()" />
        </el-select>
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('user.fields.roleIds')" prop="roleIds" style="text-align: left">
        <el-select
          v-model="userDataForm.roleIds"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :placeholder="$t('user.fields.roleIds')"
        >
          <el-option v-for="item in roleOption" :key="item.value" :label="item.label" :value="item.value.valueOf()" />
        </el-select>
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('user.fields.sex')" prop="sex" style="text-align: left">
        <el-radio-group v-model="userDataForm.sex">
          <el-radio :label="0">{{ $t('user.fields.sexInfo.woman') }}</el-radio>
          <el-radio :label="1">{{ $t('user.fields.sexInfo.man') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('user.fields.idCard')" prop="idCard">
        <el-input v-model="userDataForm.idCard" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label-width="125px" :label="$t('user.fields.isLock')" prop="isLock" style="text-align: left">
        <el-switch
          v-model="userDataForm.isLock"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#AAAAAA"
        ></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleUserDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
