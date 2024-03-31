<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 测试KeepAlive -->
<script setup lang="ts">
import { reactive } from 'vue'

defineOptions({
  name: 'keepAlive',
  inheritAttrs: false,
})

// do not use same name with ref
const form = reactive({
  name: '',
  region: '',
})

const onSubmit = () => {
  console.log('submit!')
}
</script>

<template>
  <el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="Activity name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select v-model="form.region" placeholder="please select your zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped></style>
