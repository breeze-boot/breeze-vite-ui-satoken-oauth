<!--
 * @author: gaoweixuan
 * @since: 2024-01-31
-->
<script setup lang="ts" name="navStyle">
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
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.layout-vertical,
.layout-horizontal,
.layout-mix,
.layout-columns {
  width: 70px;
  height: 60px;
  border-radius: 5px;
  cursor: pointer;
  margin: 10%;
}

.layout-vertical:hover,
.layout-horizontal:hover,
.layout-mix:hover,
.layout-columns:hover {
  box-shadow: 2px 2px 5px rgba(61, 61, 61, 0.5);
}

.layout-vertical {
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

.layout-horizontal {
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
.layout-columns {
  display: flex;

  .aside {
    background: rgba(4, 229, 52, 0.68);
    width: 22%;
    height: 100%;
  }

  .aside:first-child {
    background: rgba(64, 158, 255, 0.5);
    width: 8%;
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
</style>
