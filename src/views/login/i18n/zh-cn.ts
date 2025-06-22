export default {
  login: {
    userPassword: {
      fields: {
        username: '用户名',
        password: '密码',
        tenantId: '租户',
      },
      rules: {
        username: '请输入用户名',
        password: '密码应为6~16位的任意组合',
      },
    },
    phone: {
      fields: {
        phone: '手机号',
        code: '验证码',
        tenantId: '租户',
      },
      rules: {
        phone: '请输入手机号',
        code: '请输入验证码',
      },
    },
    email: {
      fields: {
        email: '邮箱',
        code: '验证码',
        tenantId: '租户',
      },
      rules: {
        email: '请输入邮箱',
        code: '请输入验证码',
      },
    },
    common: {
      loginSuccess: '登录成功',
      login: '登录',
      otherWay: '其他方式',
    },
  },
}
