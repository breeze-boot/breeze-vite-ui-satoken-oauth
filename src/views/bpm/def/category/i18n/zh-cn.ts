export default {
  category: {
    fields: {
      categoryName: '分类名称',
      categoryCode: '分类编码',
      tenantId: '租户',
    },
    rules: {
      categoryName: '请输入分类名称',
      categoryCode: '请输入分类编码',
      tenantId: '请选择租户',
      categoryCodeDuplicate: '输入的分类编码重复',
    },
  },
}
