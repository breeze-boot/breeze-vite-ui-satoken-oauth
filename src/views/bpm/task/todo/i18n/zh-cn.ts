export default {
  todo: {
    fields: {
      taskName: '任务节点名称',
      taskDefKey: '任务节点定义KEY',
      procInstId: '流程实例ID',
      procDefId: '流程定义ID',
      procDefKey: '流程定义KEY',
      businessKey: '业务KEY',
      applyUser: '申请人',
      applyUserName: '申请人用户名',
      status: '状态',
      assignee: '任务审批人',
      assigneeName: '任务审批人',
      formKey: '表单KEY',
      createTime: '创建时间',
      isAssigned: '是否签收',
      assigned: {
        notAssigned: '未签收',
        assigned: '已签收',
      },
    },
    common: { approval: '审批', notAssignee: '不可审批' },
    rules: {},
  },
}
