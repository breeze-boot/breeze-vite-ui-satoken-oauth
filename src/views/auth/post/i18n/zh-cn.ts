export default {
  post: {
    fields: {
      postCode: '岗位编码',
      postName: '岗位名',
    },
    rules: {
      postCode: '请输入岗位编码',
      postName: '请输入岗位名称',
      postCodeExists: '岗位编码已存在',
    },
  },
}
