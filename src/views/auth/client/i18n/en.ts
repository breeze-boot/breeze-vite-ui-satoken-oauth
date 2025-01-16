export default {
  client: {
    fields: {
      clientId: 'client id',
      clientName: 'client name',
      clientSecret: 'client secret',
      confirmClientSecret: 'confirm client secret',
      clientIdIssuedAt: 'clientIdIssuedAt',
      redirectUris: 'redirectUris',
      scopes: 'scopes',
      authorizationGrantTypes: 'authorization grant types',
      clientAuthenticationMethods: 'client authentication methods',
      clientSecretExpiresAt: 'client secret expires at',
      clientSettings: 'client settings',
    },
    rules: {
      clientCodeExists: 'The input client code already exists',
    },
  },
}
