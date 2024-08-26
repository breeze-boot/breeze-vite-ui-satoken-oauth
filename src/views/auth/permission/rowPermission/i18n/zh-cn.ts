export default {
  rowPermission: {
    fields: {
      permissionName: '权限名称',
      permissionCode: '权限编码',
      permissions: '权限集',
      customizesType: '自定义',
      createName: '创建人',
      user: '用户',
      dept: '部门',
    },
    rules: {
      permissionCode: '请输入权限编码',
      permissionName: '请输入权限名称',
      permissionCodeExists: '权限编码已存在',
      permissions: '请选择权限',
    },
  },
}
