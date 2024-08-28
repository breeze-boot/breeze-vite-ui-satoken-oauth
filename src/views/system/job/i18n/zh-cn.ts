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
    common: {
      jobRunSuccess: '运行成功',
      jobRunImmediately: '立即运行',
    },
    rules: {
      cronExpression: '请设置cron表达式',
      clazzName: '请输入执行类名.方法(参数)',
    },
  },
  jLog: {
    fields: {
      jobName: '任务名称',
      jobGroupName: '任务组名',
      cronExpression: 'cron表达式',
      clazzName: '调用方法',
      jobMessage: '任务信息',
      exceptionInfo: '异常信息',
      jobStatus: '任务执行状态',
      endTime: '执行结束时间',
    },
    common: {
      jLogViewing: '任务日志查看',
    },
  },
}
