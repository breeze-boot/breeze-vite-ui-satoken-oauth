<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { loadGreetings } from '@/utils/times'
import useUserStore from '@/store/modules/user'
import useSettingStore from '@/store/modules/setting.ts'

let settings = useSettingStore().settings
let userStore = useUserStore()
</script>

<template>
  <el-card>
    <div class="box">
      <img :src="userStore.userInfo?.avatar || settings.logoUrl" alt="" class="avatar" />
      <div class="footer">
        <h3 class="title">
          {{ loadGreetings() }}好 ~
          <span class="gradient">{{ userStore.userInfo?.username }}</span>
        </h3>
        <p class="subtitle" v-has="['ROLE_ADMIN1']">{{ settings.title }}</p>
      </div>
    </div>
  </el-card>
  <div class="bottom"></div>
</template>

<style lang="scss" scoped>
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .footer {
    margin-top: 15px;
    margin-left: 20px;

    .title {
      margin-bottom: 30px;
      font-size: 35px;
      font-weight: 900;

      .gradient {
        font-size: 24px;
        font-weight: bold;
        color: transparent;
        background: linear-gradient(to right, #001529, #001529, #fff);
        /* 渐变方向是从左到右，颜色从红色到绿色 */
        background-clip: text;
        /* 兼容WebKit浏览器（例如Chrome和Safari） */
        -webkit-background-clip: text;
      }
    }

    .subtitle {
      font-style: italic;
      font-weight: 700;
      color: #ccc;
    }
  }
}

.bottom {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
