export default {
  post: {
    fields: {
      postCode: 'post code',
      postName: 'post name',
    },
    rules: {
      postCodeExists: 'The input post code already exists',
    },
  },
}
