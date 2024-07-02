export default {
  definition: {
    fields: {
      formKey: '表单 Key',
      categoryCode: '分类编码',
      definitionKey: '部署流程key',
      definitionName: '部署名称',
      categoryName: '分类',
      tenantId: '租户ID',
      deploymentTime: '部署时间',
      version: '版本',
      suspended: '暂停',
    },
    confirmMsg: '是否保存',
    rules: {
      definitionName: '请输入流程定义名称',
      categoryCode: '请选择分类编码',
      definitionKey: '请获取流程定义KEY',
      definitionKeyCannotStartWithNumber: '不能以数字开头',
      definitionNameCannotStartWithNumber: '不能以数字开头',
    },
  },
}
