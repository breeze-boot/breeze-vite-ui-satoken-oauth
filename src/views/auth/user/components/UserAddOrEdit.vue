<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 用户添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { addUser, getUser, editUser, checkUsername } from '@/api/auth/user'
import { UserForm } from '@/api/auth/user/type.ts'
import { useI18n } from 'vue-i18n'
import { SelectData } from '@/types/types.ts'
import JSONBigInt from 'json-bigint'
import AvatarUpload from '@/components/Upload/AvatarUpload/index.vue'
import { useMessage } from '@/hooks/message'
import { selectDept } from '@/api/auth/dept'
import { selectPost } from '@/api/auth/post'
import { selectRole } from '@/api/auth/role'
import { useDict } from '@/hooks/dict'

defineOptions({
  name: 'UserAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $message = useMessage()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const deptOption = ref<SelectData[]>()
const roleOption = ref<SelectData[]>()
const postOption = ref<SelectData[]>()
const { SEX } = useDict('SEX')
const userDataFormRef = ref()
const userDataForm = ref<UserForm>({})
const rules = ref({
  username: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('user.fields.username'),
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
      message: t('common.placeholder.enter') + t('user.fields.userCode'),
      trigger: 'blur',
    },
  ],
  phone: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('user.fields.phone'),
      trigger: 'blur',
    },
  ],
  postId: [
    {
      required: true,
      message: t('common.placeholder.choose') + t('user.fields.post'),
      trigger: 'change',
    },
  ],
  deptId: [
    {
      required: true,
      message: t('common.placeholder.choose') + t('user.fields.dept'),
      trigger: 'change',
    },
  ],
  roleIds: [
    {
      required: true,
      message: t('common.placeholder.choose') + t('user.fields.roleIds'),
      trigger: 'change',
    },
  ],
  sex: [
    {
      required: true,
      message: t('common.placeholder.choose') + t('user.fields.sex'),
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
      message: t('common.placeholder.enter') + t('user.fields.email'),
      trigger: 'blur',
    },
  ],
  idCard: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('user.fields.idCard'),
      trigger: 'blur',
    },
  ],
  displayName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('user.fields.displayName'),
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
  userDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (userDataFormRef.value) {
    // TODO
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
  try {
    const response: any = await selectPost()
    postOption.value = response.data
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 初始化角色下拉框数据
 */
const initSelectRole = async () => {
  try {
    const response: any = await selectRole()
    roleOption.value = response.data
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 初始化部门下拉框数据
 */
const initSelectDept = async () => {
  try {
    const response: any = await selectDept()
    deptOption.value = response.data
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  try {
    const response: any = await getUser(JSONBigInt.parse(id))
    Object.assign(userDataForm.value, response.data)
    userDataForm.value.password = ''
    userDataForm.value.confirmPassword = ''
  } catch (err: any) {
    $message.error(`${t('common.fail')} ${err.message}`)
  }
}

/**
 * 表单提交
 */
const handleUserDataFormSubmit = async () => {
  await userDataFormRef.value.validate()
  loading.value = true
  const id = userDataForm.value.id
  try {
    id ? await editUser(id, userDataForm.value) : await addUser(userDataForm.value)
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
    :title="!userDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="userDataForm"
      :rules="rules"
      ref="userDataFormRef"
      @keyup.enter="handleUserDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item label-width="0px" prop="avatar">
        <avatar-upload v-model="userDataForm.avatar" />
      </el-form-item>
      <el-form-item :label="t('user.fields.username')" prop="username">
        <el-input
          v-model="userDataForm.username"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('user.fields.username')"
        />
      </el-form-item>
      <el-form-item v-if="!userDataForm.id" :label="t('user.fields.password')" prop="password">
        <el-input
          v-model="userDataForm.password"
          autocomplete="off"
          clearable
          show-password
          type="password"
          :placeholder="t('common.placeholder.enter') + t('user.fields.password')"
        />
      </el-form-item>
      <el-form-item v-if="!userDataForm.id" :label="t('user.fields.confirmPassword')" prop="confirmPassword">
        <el-input
          v-model="userDataForm.confirmPassword"
          autocomplete="off"
          clearable
          show-password
          type="password"
          :placeholder="t('common.placeholder.enter') + t('user.fields.confirmPassword')"
        />
      </el-form-item>
      <el-form-item :label="t('user.fields.userCode')" prop="userCode">
        <el-input
          v-model="userDataForm.userCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('user.fields.userCode')"
        />
      </el-form-item>
      <el-form-item :label="t('user.fields.phone')" prop="phone">
        <el-input
          v-model="userDataForm.phone"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('user.fields.phone')"
        />
      </el-form-item>
      <el-form-item :label="t('user.fields.email')" prop="email">
        <el-input
          v-model="userDataForm.email"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('user.fields.email')"
        />
      </el-form-item>
      <el-form-item :label="t('user.fields.displayName')" prop="displayName">
        <el-input
          v-model="userDataForm.displayName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('user.fields.displayName')"
        />
      </el-form-item>
      <el-form-item class="dept" :label="t('user.fields.dept')" prop="deptId">
        <el-cascader
          tag-type="info"
          v-model="userDataForm.deptId"
          :options="deptOption"
          :props="{ checkStrictly: true, emitPath: false, value: 'value', label: 'label' }"
          :show-all-levels="false"
          clearable
          filterable
          :placeholder="t('common.placeholder.choose') + t('user.fields.dept')"
        />
      </el-form-item>
      <el-form-item :label="t('user.fields.post')" style="text-align: left" prop="postId">
        <el-select
          v-model="userDataForm.postId"
          collapse-tags
          filterable
          :placeholder="t('common.placeholder.choose') + t('user.fields.post')"
        >
          <el-option v-for="item in postOption" :key="item.value" :label="item.label" :value="item.value.valueOf()" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('user.fields.roleIds')" prop="roleIds" style="text-align: left">
        <el-select
          v-model="userDataForm.roleIds"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :placeholder="t('common.placeholder.choose') + t('user.fields.roleIds')"
        >
          <el-option v-for="item in roleOption" :key="item.value" :label="item.label" :value="item.value.valueOf()" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('user.fields.sex')" prop="sex" style="text-align: left">
        <el-radio-group v-model="userDataForm.sex">
          <el-radio v-for="(item, index) in SEX" :key="index" :label="item.label" :value="Number(item.value)" />
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('user.fields.idCard')" prop="idCard">
        <el-input
          v-model="userDataForm.idCard"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('user.fields.idCard')"
        />
      </el-form-item>
      <el-form-item :label="t('user.fields.isLock')" prop="isLock" style="text-align: left">
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
      <el-button type="primary" :loading="loading" @click="handleUserDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
