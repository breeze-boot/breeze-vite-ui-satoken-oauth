<!--
 * @author: gaoweixuan
 * @since: 2024-08-12
-->

<!-- 测试hiPrint -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { hiprint } from 'vue-plugin-hiprint'
import $ from 'jquery'

defineOptions({
  name: 'hiPrint',
  inheritAttrs: false,
})

onMounted(() => {
  initHiprint()
})

// 执行打印
const doPrint = () => {
  // hiprint对象获取
  let printerList: any[]
  printerList = hiprint.hiwebSocket.getPrinterList()
  console.log('打印机列表:', printerList)

  // let hiprintTemplate = new hiprint.PrintTemplate({
  //   template: JSON.parse(globalTemplateContent),
  // })
  // console.log('转化后的模板信息:', hiprintTemplate)

  // 下列方法都是没有拖拽设计页面的, 相当于代码模式, 使用代码设计页面
  // 想要实现拖拽设计页面,请往下看 '自定义设计'
  let hiprintTemplate = new hiprint.PrintTemplate()
  let panel = hiprintTemplate.addPrintPanel({ width: 100, height: 130, paperFooter: 340, paperHeader: 10 })
  //文本
  panel.addPrintText({
    options: { width: 140, height: 15, top: 20, left: 20, title: 'hiprint插件手动添加text', textAlign: 'center' },
  })
  //条形码
  panel.addPrintText({ options: { width: 140, height: 35, top: 40, left: 20, title: '123456', textType: 'barcode' } })
  panel.addPrintHtml({ options: { width: 140, height: 35, top: 180, left: 20, content: $('#testTable').html() } })
  //二维码
  panel.addPrintText({ options: { width: 35, height: 35, top: 40, left: 165, title: '123456', textType: 'qrcode' } })
  //长文本
  panel.addPrintLongText({
    options: {
      width: 180,
      height: 35,
      top: 90,
      left: 20,
      title: '长文本：hiprint是一个很好的webjs打印,浏览器在的地方他都可以运行',
    },
  })
  // 直接打印 将使用系统设置的 默认打印机
  hiprintTemplate.print2({
    printer: printerList[4].name, // 指定打印机 打印机 名称
    title: 'test',
    color: false, // 是否打印颜色 默认 true
    copies: 1, // 打印份数 默认 1
  })
}

/**
 * 初始化打印客户端
 */
const initHiprint = () => {
  hiprint.init({
    host: 'http://127.0.0.1:17521', // 打印客户端地址
    token: '', // 用于连接打印客户端的token
  })
  console.log(hiprint)
}
</script>

<template>
  <div style="">
    <div id="testTable" style="width: 100%">
      <div style="width: 100px">123123</div>
      <div style="width: 100px">123123</div>
      <div style="width: 100px">123123</div>
      <div style="width: 100px">123123</div>
      <div style="width: 100px">123123</div>
      <div style="width: 100px">123123</div>
    </div>
    <el-button @click="doPrint">打印</el-button>
  </div>
</template>

<style lang="scss" scoped></style>
