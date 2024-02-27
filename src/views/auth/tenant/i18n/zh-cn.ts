export default {
  tenant: {
    fields: {
      tenantCode: '租户编码',
      tenantName: '租户名',
    },
    rules: {
      tenantCode: '请输入租户编码',
      tenantName: '请输入租户名称',
      tenantCodeExists: '租户编码已存在',
    },
  },
}
