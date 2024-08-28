export default {
  dept: {
    fields: {
      superiorDept: '上级部门',
      deptName: '部门名称',
      deptCode: '部门编码',
    },
    common: { addSubDept: '添加子级部门' },
    rules: {
      deptCodeExists: '输入的部门编码已存在',
    },
  },
}
