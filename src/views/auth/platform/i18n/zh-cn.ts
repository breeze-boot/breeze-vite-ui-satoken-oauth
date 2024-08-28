export default {
  platform: {
    fields: {
      platformName: '平台名称',
      platformCode: '平台编码',
      description: '描述',
    },
    rules: {
      platformCodeExists: '输入的平台编码重复',
    },
  },
}
