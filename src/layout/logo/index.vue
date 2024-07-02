<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import useSettingStore from '@/store/modules/setting.ts'

let settingStore = useSettingStore()
const { settings } = settingStore
</script>

<template>
  <div class="logo" v-if="settings.logoHidden">
    <img :src="settings.logoUrl" alt="" />
    <span class="title">
      {{ settings.title }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: 95%;
  height: 50px;
  padding-left: 5px;
  overflow: hidden;
  font-size: $base-logo-font-size;
  font-weight: $base-logo-font-weight;

  img {
    display: inline-block;
    widows: 30;
    height: auto;
    border-radius: 10px;
  }

  .title {
    color: $base-text-color;
    display: inline-block;
    margin: 2px 0 0 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
