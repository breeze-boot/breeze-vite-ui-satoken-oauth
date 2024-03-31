export default {
  dept: {
    fields: {
      superiorDept: 'superior dept',
      deptName: 'dept name',
      deptCode: 'dept code',
    },
    common: { addSubDept: 'add sub dept' },
    rules: {
      parentId: 'Please select the parent department',
      deptName: 'Please enter the name of the department',
      deptCode: 'Please enter the code of the department',
      deptCodeExists: 'The entered department code is exits',
    },
  },
}
