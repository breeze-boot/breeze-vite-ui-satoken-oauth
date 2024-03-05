export default {
  dict: {
    fields: {
      dictCode: '字典编码',
      dictName: '字典名称',
      status: '状态',
    },
    common: {},
    rules: {
      dictCode: '请输入字典编码',
      dictName: '请输入字典名称',
    },
  },
  dictItem: {
    fields: {
      label: '标签',
      value: '值',
      type: '类型',
    },
    common: {
      dictItemViewing: '字典项查看',
    },
    rules: {
      label: '请输入字典的标签',
      value: '请输入字典的值',
      type: '请选择字典标签类型',
    },
  },
}
