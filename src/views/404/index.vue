<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts"></script>
<template>
  <div class="error-container">
    <h1 class="error-code">404</h1>
    <p class="error-message">抱歉，您访问的页面不存在。</p>
  </div>
</template>

<style lang="scss" scoped>
.error-container {
  position: relative;
  padding: 50px 30px;
  margin: 10px auto;
  text-align: center;
  border-radius: 10px;
}

.error-code {
  margin-bottom: 20px;
  font-family: Pacifico, cursive; /* 使用Google Fonts的艺术字体 */
  font-size: 150px;
  line-height: 1;
  color: var(--el-color-primary);
  text-shadow: 2px 2px 4px rgb(0 0 0 / 10%); /* 添加阴影以增强立体感 */
}

.error-message {
  margin-bottom: 30px;
  font-size: 24px;
  color: var(--el-color-primary);
}
</style>
