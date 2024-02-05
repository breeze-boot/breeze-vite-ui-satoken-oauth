<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addUser, getUser, editUser } from '@/api/auth/user'
import { User } from '@/api/auth/user/type.ts'

const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const userDataFormRef = ref()
const userDataForm = reactive<User>({})
const rules = ref({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
})

const init = (id?: number) => {
  visible.value = true
  userDataForm.id = undefined
  // 重置表单数据
  if (userDataFormRef.value) {
    userDataFormRef.value.resetFields()
  }
  if (id) {
    getInfo(id)
  }
}

// 获取信息
const getInfo = (id: number) => {
  getUser(id).then((response: any) => {
    if (response.code === '00000') {
      Object.assign(userDataForm, response.data)
    }
  })
}

// 表单提交
const handleUserDataFormSubmit = () => {
  userDataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    const bankId = userDataForm.id
    if (bankId) {
      editUser(userDataForm)
        .then(() => {
          ElMessage.success({
            message: '成功',
            duration: 500,
            onClose: () => {
              visible.value = false
              $emit('reloadDataList')
            },
          })
        })
        .finally(() => {})
    } else {
      addUser(userDataForm)
        .then(() => {
          ElMessage.success({
            message: '成功',
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
    :title="!userDataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="userDataForm"
      :rules="rules"
      ref="userDataFormRef"
      @keyup.enter="handleUserDataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userDataForm.username" placeholder="用户名" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleUserDataFormSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>
