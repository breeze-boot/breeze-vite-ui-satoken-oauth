export default {
  client: {
    fields: {
      clientId: '客户端标识',
      clientName: '客户端名',
      clientSecret: '客户密钥',
      confirmClientSecret: '确认密钥',
      clientIdIssuedAt: '发布日期',
      redirectUris: '重定向URI',
      scopes: '权限范围',
      authorizationGrantTypes: '授权许可类型',
      clientAuthenticationMethods: '身份验证方法',
      clientSecretExpiresAt: '密钥到期时间',
    },
    rules: {
      clientCodeExists: '客户端编码已存在',
    },
  },
}
