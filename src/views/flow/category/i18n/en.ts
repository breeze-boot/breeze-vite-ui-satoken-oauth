export default {
  category: {
    fields: {
      categoryName: 'category name',
      categoryCode: 'category code',
      tenantId: 'tenantId',
    },
    rules: {
      categoryName: 'Please enter the category name',
      categoryCode: 'Please enter category code',
      tenantId: 'Please select tenant',
      categoryCodeDuplicate: 'The category code entered is duplicate',
    },
  },
}
