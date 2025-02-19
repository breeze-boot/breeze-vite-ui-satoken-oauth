<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { loadGreetings } from '@/utils/times'
import useUserStore from '@/store/modules/user'
import useSettingStore from '@/store/modules/setting.ts'
import LoginUserPie from '@/views/home/component/LoginUserPie.vue'

let settings = useSettingStore().settings
let userStore = useUserStore()
</script>

<template>
  <el-row :gutter="24">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <el-card>
        <div class="header">
          <div>
            <el-avatar :size="100" :src="userStore.userInfo?.avatar || settings.logoUrl" />
          </div>
          <div class="greeting">
            <h3 class="title">
              {{ loadGreetings() }}~
              <span class="gradient">欢迎登录！每一天，都是您迈向卓越的新起点！</span>
            </h3>
            <p class="subtitle">当前登录账户：{{ userStore.userInfo?.username }}</p>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <el-row :gutter="24">
    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>在线统计</span>
          </div>
        </template>
        <login-user-pie />
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>总览</span>
          </div>
        </template>
        ing...
      </el-card>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.el-card {
  margin: 5px !important;
}
.el-row {
  margin: 0 !important;
  padding: 0 !important;
}
.el-col {
  margin: 0 !important;
  padding: 0 !important;
}
.header {
  display: flex;
  align-items: center;
  justify-items: center;

  .greeting {
    margin-top: 15px;
    margin-left: 20px;

    .title {
      margin-bottom: 30px;
      font-size: 1.2rem;
      font-weight: 900;

      .gradient {
        font-size: 1.1rem;
        font-weight: bold;
        color: transparent;
        background: linear-gradient(to right, #001529, #001529, var(--el-color-primary));
        /* 渐变方向是从左到右 */
        background-clip: text;
        /* 兼容WebKit浏览器（例如Chrome和Safari） */
        -webkit-background-clip: text;
      }
    }

    .subtitle {
      font-size: 0.8rem;
      font-style: italic;
      font-weight: 500;
      color: #676767;
    }
  }
}
</style>
