export default {
  tenant: {
    fields: {
      tenantCode: 'tenant code',
      tenantName: 'tenant name',
    },
    rules: {
      tenantCode: 'Please enter your tenant code',
      tenantName: 'Please enter your tenant name',
      tenantCodeExists: 'The input tenant code already exists',
    },
  },
}
