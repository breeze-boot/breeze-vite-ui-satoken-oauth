export default {
  post: {
    fields: {
      postCode: 'post code',
      postName: 'post name',
    },
    rules: {
      postCode: 'Please enter your post code',
      postName: 'Please enter your post name',
      postCodeExists: 'The input post code already exists',
    },
  },
}
