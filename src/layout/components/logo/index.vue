<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useSettingStore from '@/store/modules/setting.ts'

const props = defineProps({
  title: {
    type: Boolean,
    default: true,
  },
  logoImg: {
    type: Boolean,
    default: true,
  },
})

let { settings } = storeToRefs(useSettingStore())
</script>

<template>
  <div class="breeze-logo" v-if="settings.logoHidden">
    <div class="logo-img" v-show="props.logoImg">
      <img :src="settings.logoUrl" alt="" />
    </div>
    <div class="title" v-show="props.title && !settings.isCollapse">
      {{ settings.title }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.breeze-logo {
  --el-font-family: 'Comic Sans MS', 'Helvetica Neue', Arial, sans-serif; /* 自定义字体 */

  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  padding: 0 10px;
  overflow: hidden;
  font-family: var(--el-font-family);
  font-size: $base-logo-font-size;
  font-weight: $base-logo-font-weight;

  .logo-img {
    img {
      display: inline-block;
      height: auto;
      border-radius: 10px;
    }
  }

  .title {
    overflow: hidden;
    color: var(--base-text-color);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
