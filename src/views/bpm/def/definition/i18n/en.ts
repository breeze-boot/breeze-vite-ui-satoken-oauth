export default {
  definition: {
    fields: {
      formKey: 'form key',
      categoryCode: 'category code',
      procDefKey: 'definition key',
      procDefName: 'definition name',
      categoryName: 'category name',
      tenantId: 'tenantId',
      deploymentTime: 'deploymentTime',
      version: 'version',
      suspended: 'suspended',
    },
    confirmMsg: '是否保存',
    rules: {
      definitionName: 'Please enter the definition name',
      categoryCode: 'Please select category code',
      definitionKey: 'Please get definition key',
      definitionKeyCannotStartWithNumber: 'Cannot start with a number',
      definitionNameCannotStartWithNumber: 'Cannot start with a number',
    },
  },
}
