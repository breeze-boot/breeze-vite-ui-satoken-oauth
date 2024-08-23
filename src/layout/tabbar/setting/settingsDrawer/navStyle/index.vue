<!--
 * @author: gaoweixuan
 * @since: 2024-01-31
-->
<script setup lang="ts" name="navStyle">
import { storeToRefs } from 'pinia'
import useSettingStore from '@/store/modules/setting.ts'

let settingStore = useSettingStore()
let { theme } = storeToRefs(settingStore)

/**
 * 改变布局
 */
const handleClickMenuStyle = (item: string) => {
  settingStore.setMenuLayout(item)
}
</script>

<template>
  <div
    class="layout-left"
    :style="
      theme.menuLayout === 'left'
        ? {
            boxShadow: '2px 2px 10px rgba(162, 162, 162, 0.8)',
          }
        : {}
    "
    @click="handleClickMenuStyle('left')"
  >
    <div class="aside"></div>
    <div class="main">
      <div></div>
      <div></div>
    </div>
  </div>
  <div
    class="layout-top"
    :style="
      theme.menuLayout === 'top'
        ? {
            boxShadow: '2px 2px 10px rgba(162, 162, 162, 0.8)',
          }
        : {}
    "
    @click="handleClickMenuStyle('top')"
  >
    <div class="header"></div>
    <div class="main"></div>
  </div>
  <div
    class="layout-mix"
    :style="
      theme.menuLayout === 'mix'
        ? {
            boxShadow: '2px 2px 10px rgba(162, 162, 162, 0.8)',
          }
        : {}
    "
    @click="handleClickMenuStyle('mix')"
  >
    <div class="header"></div>
    <div class="main">
      <div></div>
      <div></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.layout-left,
.layout-top,
.layout-mix {
  width: 50px;
  height: 40px;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
}

.layout-left {
  display: flex;

  .aside {
    background: rgba(64, 158, 255, 0.5);
    width: 30%;
    height: 100%;
    border-radius: 5px 0 0 5px;
  }

  .main {
    width: 70%;
    height: 100%;
    border-radius: 0 5px 5px 0;

    div:first-child {
      background: rgba(103, 194, 58, 0.5);
      width: 100%;
      height: 20%;
      border-radius: 0 5px 0 0;
    }
    div:last-child {
      background: rgba(230, 162, 60, 0.5);
      width: 100%;
      height: 80%;
      border-radius: 0 0 5px 0;
    }
  }
}

.layout-top {
  .header {
    background: rgba(64, 158, 255, 0.5);
    width: 100%;
    height: 20%;
    border-radius: 5px 5px 0 0;
  }

  .main {
    background: rgba(103, 194, 58, 0.5);
    width: 100%;
    height: 80%;
    border-radius: 0 0 5px 5px;
  }
}

.layout-mix {
  .header {
    background: rgba(64, 158, 255, 0.5);
    width: 100%;
    height: 20%;
    border-radius: 5px 5px 0 0;
  }

  .main {
    background: #e6a23c;
    width: 100%;
    height: 80%;
    border-radius: 0 0 5px 5px;
    display: flex;

    div:first-child {
      background: rgba(103, 194, 58, 0.5);
      width: 20%;
      height: 100%;
      border-radius: 0 0 0 5px;
    }
    div:last-child {
      background: rgba(255, 255, 255, 0.53);
      width: 80%;
      height: 100%;
      border-radius: 0 0 5px 0;
    }
  }
}
</style>
