export default {
  dept: {
    fields: {
      superiorDept: 'superior dept',
      deptName: 'dept name',
      deptCode: 'dept code',
    },
    common: { addSubDept: 'add sub dept' },
    rules: {
      deptCodeExists: 'The entered department code is exits',
    },
  },
}
