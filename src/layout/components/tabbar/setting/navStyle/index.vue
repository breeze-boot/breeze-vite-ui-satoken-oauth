<!--
 * @author: gaoweixuan
 * @since: 2024-01-31
-->
<script setup lang="ts" name="NavStyle">
import { storeToRefs } from 'pinia'
import useSettingStore from '@/store/modules/setting.ts'
import { MenuLayout } from '@/types/types.ts'
import { LAYOUT } from '@/utils/common.ts'

let settingStore = useSettingStore()
let { theme } = storeToRefs(settingStore)

/**
 * 改变布局
 */
const handleClickMenuStyle = (item: string) => {
  settingStore.setMenuLayout(item as MenuLayout)
}
</script>

<template>
  <div class="layout-style">
    <div
      class="layout-vertical"
      :style="
        theme.menuLayout === LAYOUT.VERTICAL
          ? {
              boxShadow: '2px 2px 5px rgba(61, 61, 61, 0.5)',
            }
          : {}
      "
      @click="handleClickMenuStyle(LAYOUT.VERTICAL)"
    >
      <div class="aside"></div>
      <div class="main">
        <div></div>
        <div></div>
      </div>
    </div>

    <div
      class="layout-horizontal"
      :style="
        theme.menuLayout === LAYOUT.HORIZONTAL
          ? {
              boxShadow: '2px 2px 5px rgba(61, 61, 61, 0.5)',
            }
          : {}
      "
      @click="handleClickMenuStyle(LAYOUT.HORIZONTAL)"
    >
      <div class="header"></div>
      <div class="main"></div>
    </div>

    <div
      class="layout-mix"
      :style="
        theme.menuLayout === LAYOUT.MIX
          ? {
              boxShadow: '2px 2px 5px rgba(61, 61, 61, 0.5)',
            }
          : {}
      "
      @click="handleClickMenuStyle(LAYOUT.MIX)"
    >
      <div class="header"></div>
      <div class="main">
        <div></div>
        <div></div>
      </div>
    </div>

    <div
      class="layout-columns"
      :style="
        theme.menuLayout === LAYOUT.COLUMNS
          ? {
              boxShadow: '2px 2px 5px rgba(61, 61, 61, 0.5)',
            }
          : {}
      "
      @click="handleClickMenuStyle(LAYOUT.COLUMNS)"
    >
      <div class="aside"></div>
      <div class="aside"></div>
      <div class="main">
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-style {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.layout-vertical,
.layout-horizontal,
.layout-mix,
.layout-columns {
  width: 65px;
  height: 60px;
  margin: 1.5%;
  cursor: pointer;
  border-radius: 5px;
}

.layout-vertical:hover,
.layout-horizontal:hover,
.layout-mix:hover,
.layout-columns:hover {
  box-shadow: 2px 2px 5px rgb(61 61 61 / 50%);
}

.layout-vertical {
  display: flex;

  .aside {
    width: 30%;
    height: 100%;
    background: rgb(64 158 255 / 50%);
    border-radius: 5px 0 0 5px;
  }

  .main {
    width: 70%;
    height: 100%;
    border-radius: 0 5px 5px 0;

    div:first-child {
      width: 100%;
      height: 20%;
      background: rgb(103 194 58 / 50%);
      border-radius: 0 5px 0 0;
    }

    div:last-child {
      width: 100%;
      height: 80%;
      background: rgb(230 162 60 / 50%);
      border-radius: 0 0 5px;
    }
  }
}

.layout-horizontal {
  .header {
    width: 100%;
    height: 20%;
    background: rgb(64 158 255 / 50%);
    border-radius: 5px 5px 0 0;
  }

  .main {
    width: 100%;
    height: 80%;
    background: rgb(103 194 58 / 50%);
    border-radius: 0 0 5px 5px;
  }
}

.layout-mix {
  .header {
    width: 100%;
    height: 20%;
    background: rgb(64 158 255 / 50%);
    border-radius: 5px 5px 0 0;
  }

  .main {
    display: flex;
    width: 100%;
    height: 80%;
    background: #e6a23c;
    border-radius: 0 0 5px 5px;

    div:first-child {
      width: 20%;
      height: 100%;
      background: rgb(103 194 58 / 50%);
      border-radius: 0 0 0 5px;
    }

    div:last-child {
      width: 80%;
      height: 100%;
      background: rgb(255 255 255 / 53%);
      border-radius: 0 0 5px;
    }
  }
}

.layout-columns {
  display: flex;

  .aside {
    width: 22%;
    height: 100%;
    background: rgb(4 229 52 / 68%);
  }

  .aside:first-child {
    width: 8%;
    height: 100%;
    background: rgb(64 158 255 / 50%);
    border-radius: 5px 0 0 5px;
  }

  .main {
    width: 70%;
    height: 100%;
    border-radius: 0 5px 5px 0;

    div:first-child {
      width: 100%;
      height: 20%;
      background: rgb(103 194 58 / 50%);
      border-radius: 0 5px 0 0;
    }

    div:last-child {
      width: 100%;
      height: 80%;
      background: rgb(230 162 60 / 50%);
      border-radius: 0 0 5px;
    }
  }
}
</style>
