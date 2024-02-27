export default {
  post: {
    fields: {
      postCode: '角色编码',
      postName: '角色名',
    },
    rules: {
      postCode: '请输入角色编码',
      postName: '请输入角色名称',
      postCodeExists: '角色编码已存在',
    },
  },
}
