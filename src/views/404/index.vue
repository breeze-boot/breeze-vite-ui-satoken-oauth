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
  margin: 10px auto;
  position: relative;
  border-radius: 10px;
  padding: 50px 30px;
  text-align: center;
}

.error-code {
  font-size: 150px;
  line-height: 1;
  font-family: 'Pacifico', cursive; /* 使用Google Fonts的艺术字体 */
  color: var(--el-color-primary);
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影以增强立体感 */
}

.error-message {
  font-size: 24px;
  margin-bottom: 30px;
  color: var(--el-color-primary);
}
</style>
