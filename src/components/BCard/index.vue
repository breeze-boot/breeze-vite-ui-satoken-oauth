<script setup lang="ts" name="BCard">
defineProps({
  cardStyle: {
    type: Object,
    default: () => ({}),
    required: false,
  },
})
</script>

<template>
  <el-card :style="cardStyle">
    <template #header>
      <div class="card-header">
        <slot name="header"></slot>
      </div>
    </template>
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-card>
</template>

<style scoped lang="scss"></style>
