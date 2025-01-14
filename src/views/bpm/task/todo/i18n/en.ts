export default {
  todo: {
    fields: {
      taskName: 'task name',
      taskDefKey: 'task definition key',
      procInstId: 'process instance id',
      procDefId: 'process definition id',
      procDefKey: 'process definition key',
      businessKey: 'business key',
      applyUser: 'apply user',
      applyUserName: 'apply user name',
      status: 'status',
      assignee: 'assignee',
      assigneeName: 'assignee name',
      formKey: 'formKey',
      createTime: 'create time',
      isAssigned: 'isAssigned',
      assigned: {
        notAssigned: '未签收',
        assigned: '已签收',
      },
    },
    common: { approval: 'approval', notAssignee: '不可审批' },
    rules: {},
  },
}
