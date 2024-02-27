export default {
  job: {
    fields: {
      jobName: '任务名称',
      jobGroupName: '任务组名',
      cronExpression: 'cron表达式',
      clazzName: '调用方法',
      misfirePolicy: '执行策略',
      concurrent: '并发',
      status: '状态',
    },
    rules: {
      jobName: '请输入任务名称',
      jobGroupName: '请选择任务组名',
      cronExpression: '请设置cron表达式',
      clazzName: '请输入执行类名.方法(参数)',
    },
  },
}
