export default {
  job: {
    fields: {
      jobName: 'job name',
      jobGroupName: 'job group name',
      cronExpression: 'cron expression',
      clazzName: 'clazz name',
      misfirePolicy: 'misfire policy',
      concurrent: 'concurrent',
      status: 'status',
    },
    rules: {
      jobName: '请输入任务名称',
      jobGroupName: '请选择任务组名',
      cronExpression: '请设置cron表达式',
      clazzName: '请输入执行类名.方法(参数)',
    },
  },
}
