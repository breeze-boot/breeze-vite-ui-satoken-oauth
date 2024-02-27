export default {
  dept: {
    fields: {
      superiorDept: '上级部门',
      deptName: '部门名称',
      deptCode: '部门编码',
    },
    rules: {
      parentId: '请选择上级部门',
      deptName: '请输入部门名称',
      deptCode: '请输入部门编码',
      deptCodeExists: '输入的部门编码已存在',
    },
  },
}
