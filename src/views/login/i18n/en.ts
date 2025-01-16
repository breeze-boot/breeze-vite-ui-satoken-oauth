export default {
  login: {
    userPassword: {
      fields: {
        username: 'Username',
        password: 'Password',
        tenantId: 'Tenant',
      },
      rules: {
        username: 'Please enter the username',
        password: 'The password should be any combination of 6~16 digits',
      },
    },
    phone: {
      fields: {
        phone: 'Phone',
        code: 'Code',
        tenantId: 'Tenant',
      },
      rules: { phone: 'Please enter the phone number', code: 'Please enter the verification code' },
    },
    email: {
      fields: {
        email: 'E-mail',
        code: 'Code',
        tenantId: 'Tenant',
      },
      rules: { phone: 'Please enter the email number', code: 'Please enter the verification code' },
    },
    common: {
      loginSuccess: 'Login Success',
    },
  },
}
