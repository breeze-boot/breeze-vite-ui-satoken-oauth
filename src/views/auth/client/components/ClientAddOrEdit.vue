<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 客户端添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addClient, editClient, getClient } from '@/api/auth/client'
import { ClientForm } from '@/api/auth/client/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useDict } from '@/hooks/dict'
import useWidth from '@/hooks/dialogWidth'

defineOptions({
  name: 'ClientAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const clientDataFormRef = ref()
const clientDataForm = ref<ClientForm>({
  authorizationGrantTypes: [],
  clientAuthenticationMethods: [],
  clientId: '',
  clientIdIssuedAt: '',
  clientName: '',
  clientSecret: '',
  clientSecretExpiresAt: '',
  clientSettings: {
    jwkSetUrl: '',
    requireAuthorizationConsent: false,
    requireProofKey: false,
    tokenEndpointAuthenticationSigningAlgorithm: '',
  },
  confirmClientSecret: '',
  redirectUris: [],
  scopes: [],
  tokenSettings: {
    accessTokenFormat: '',
    accessTokenTimeToLive: 0,
    authorizationCodeTimeToLive: 0,
    idTokenSignatureAlgorithm: '',
    refreshTokenTimeToLive: 0,
    reuseRefreshTokens: true,
  },
})

const {
  ID_TOKEN_SIGNATURE_ALGORITHM,
  ACCESS_TOKEN_FORMAT,
  TOKEN_ENDPOINT_AUTHENTICATION_SIGNING_ALGORITHM,
  SCOPES,
  AUTHORIZATION_GRANT_TYPES,
  REDIRECT_URIS,
  CLIENT_AUTHENTICATION_METHODS,
} = useDict(
  'ID_TOKEN_SIGNATURE_ALGORITHM',
  'ACCESS_TOKEN_FORMAT',
  'TOKEN_ENDPOINT_AUTHENTICATION_SIGNING_ALGORITHM',
  'SCOPES',
  'AUTHORIZATION_GRANT_TYPES',
  'REDIRECT_URIS',
  'CLIENT_AUTHENTICATION_METHODS',
)

const rules = ref({
  clientName: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('client.fields.clientName'),
      trigger: 'blur',
    },
  ],
})

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  clientDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (clientDataFormRef.value) {
    clientDataFormRef.value.resetFields()
  }
  if (id) {
    await getInfo(id)
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  const response: any = await getClient(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(clientDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleClientDataFormSubmit = () => {
  clientDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    loading.value = true
    const id = clientDataForm.value.id
    if (id) {
      await editClient(id, clientDataForm.value)
      ElMessage.success({
        message: `${t('common.modify') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          loading.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addClient(clientDataForm.value)
      ElMessage.success({
        message: `${t('common.save') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          loading.value = false
          $emit('reloadDataList')
        },
      })
    }
  })
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :width="useWidth()"
    :title="!clientDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="clientDataForm"
      :rules="rules"
      ref="clientDataFormRef"
      @keyup.enter="handleClientDataFormSubmit()"
      label-width="90px"
    >
      <div class="card">
        <el-divider>{{ t('client.fields.basicSettings') }}</el-divider>
        <el-form-item :label="t('client.fields.clientId')" prop="clientId">
          <el-input v-model="clientDataForm.clientId" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item :label="t('client.fields.clientName')" prop="clientName">
          <el-input
            v-model="clientDataForm.clientName"
            autocomplete="off"
            clearable
            :placeholder="t('common.placeholder.enter') + t('client.fields.clientName')"
          />
        </el-form-item>
        <el-form-item
          :label="t('client.fields.clientSecret')"
          prop="clientSecret"
          v-if="!clientDataForm.id && !clientDataForm.clientSettings.requireProofKey"
        >
          <el-input
            v-model="clientDataForm.clientSecret"
            autocomplete="off"
            clearable
            :placeholder="t('common.placeholder.enter') + t('client.fields.clientSecret')"
          />
        </el-form-item>
        <el-form-item
          :label="t('client.fields.confirmClientSecret')"
          prop="confirmClientSecret"
          v-if="!clientDataForm.id && !clientDataForm.clientSettings.requireProofKey"
        >
          <el-input
            v-model="clientDataForm.confirmClientSecret"
            autocomplete="off"
            clearable
            :placeholder="t('common.placeholder.enter') + t('client.fields.confirmClientSecret')"
          />
        </el-form-item>
        <el-form-item :label="t('client.fields.clientIdIssuedAt')" prop="clientIdIssuedAt">
          <el-date-picker
            v-model="clientDataForm.clientIdIssuedAt"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :placeholder="t('common.placeholder.choose') + t('client.fields.clientIdIssuedAt')"
            default-time="12:00:00"
          ></el-date-picker>
        </el-form-item>

        <el-form-item :label="t('client.fields.redirectUris')" prop="redirectUris">
          <el-select
            filterable
            allow-create
            default-first-option
            multiple
            v-model="clientDataForm.redirectUris"
            :placeholder="t('common.placeholder.enter') + t('client.fields.redirectUris')"
          >
            <el-option
              v-for="(item, index) in REDIRECT_URIS"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="t('client.fields.scopes')" prop="scopes">
          <el-select
            filterable
            multiple
            v-model="clientDataForm.scopes"
            :placeholder="t('common.placeholder.choose') + t('client.fields.scopes')"
          >
            <el-option v-for="(item, index) in SCOPES" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="t('client.fields.authorizationGrantTypes')" prop="authorizationGrantTypes">
          <el-select
            filterable
            multiple
            v-model="clientDataForm.authorizationGrantTypes"
            :placeholder="t('common.placeholder.choose') + t('client.fields.authorizationGrantTypes')"
          >
            <el-option
              v-for="(item, index) in AUTHORIZATION_GRANT_TYPES"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="t('client.fields.authorizationGrantTypes')" prop="clientAuthenticationMethods">
          <el-select
            filterable
            multiple
            v-model="clientDataForm.clientAuthenticationMethods"
            :placeholder="t('common.placeholder.choose') + t('client.fields.authorizationGrantTypes')"
          >
            <el-option
              v-for="(item, index) in CLIENT_AUTHENTICATION_METHODS"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="t('client.fields.clientSecretExpiresAt')"
          prop="clientSecretExpiresAt"
          v-if="!clientDataForm.clientSettings.requireProofKey"
        >
          <el-date-picker
            v-model="clientDataForm.clientSecretExpiresAt"
            type="datetime"
            :placeholder="t('common.placeholder.choose') + t('client.fields.clientSecretExpiresAt')"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="12:00:00"
          ></el-date-picker>
        </el-form-item>
      </div>

      <div class="card">
        <el-divider>{{ t('client.fields.clientSettings') }}</el-divider>
        <el-form-item label-width="120px" :label="t('client.fields.requireProofKey')" prop="requireProofKey">
          <el-switch
            v-model="clientDataForm.clientSettings.requireProofKey"
            :active-value="true"
            :inactive-value="false"
            active-color="#13ce66"
            inactive-color="#AAAAAA"
          ></el-switch>
        </el-form-item>

        <el-form-item
          label-width="120px"
          :label="t('client.fields.requireAuthorizationConsent')"
          prop="requireAuthorizationConsent"
        >
          <el-switch
            v-model="clientDataForm.clientSettings.requireAuthorizationConsent"
            :active-value="true"
            :inactive-value="false"
            active-color="#13ce66"
            inactive-color="#AAAAAA"
          ></el-switch>
        </el-form-item>

        <el-form-item label-width="120px" :label="t('client.fields.jwkSetUrl')" prop="jwkSetUrl">
          <el-input
            v-model="clientDataForm.clientSettings.jwkSetUrl"
            autocomplete="off"
            clearable
            :placeholder="t('common.placeholder.enter') + t('client.fields.jwkSetUrl')"
          />
        </el-form-item>

        <el-form-item
          label-width="120px"
          :label="t('client.fields.tokenEndpointAuthenticationSigningAlgorithm')"
          prop="tokenEndpointAuthenticationSigningAlgorithm"
        >
          <el-select
            v-model="clientDataForm.clientSettings.tokenEndpointAuthenticationSigningAlgorithm"
            :placeholder="
              t('common.placeholder.choose') + t('client.fields.tokenEndpointAuthenticationSigningAlgorithm')
            "
          >
            <el-option
              v-for="(item, index) in TOKEN_ENDPOINT_AUTHENTICATION_SIGNING_ALGORITHM"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="card">
        <el-divider>{{ t('client.fields.tokenSettings') }}</el-divider>
        <el-form-item
          label-width="120px"
          :label="t('client.fields.idTokenSignatureAlgorithm')"
          prop="idTokenSignatureAlgorithm"
        >
          <el-select
            v-model="clientDataForm.tokenSettings.idTokenSignatureAlgorithm"
            :placeholder="t('common.placeholder.choose') + t('client.fields.idTokenSignatureAlgorithm')"
          >
            <el-option
              v-for="(item, index) in ID_TOKEN_SIGNATURE_ALGORITHM"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="120px" :label="t('client.fields.accessTokenFormat')" prop="accessTokenFormat">
          <el-select
            v-model="clientDataForm.tokenSettings.accessTokenFormat"
            :placeholder="t('common.placeholder.choose') + t('client.fields.accessTokenFormat')"
          >
            <el-option
              v-for="(item, index) in ACCESS_TOKEN_FORMAT"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="120px" :label="t('client.fields.reuseRefreshTokens')" prop="reuseRefreshTokens">
          <el-switch
            v-model="clientDataForm.tokenSettings.reuseRefreshTokens"
            :active-value="true"
            :inactive-value="false"
            active-color="#13ce66"
            inactive-color="#AAAAAA"
          ></el-switch>
        </el-form-item>

        <el-form-item
          :label="t('client.fields.refreshTokenTimeToLive')"
          prop="refreshTokenTimeToLive"
          label-width="120px"
          v-if="clientDataForm.tokenSettings.reuseRefreshTokens"
        >
          <el-input
            v-model="clientDataForm.tokenSettings.refreshTokenTimeToLive"
            autocomplete="off"
            :placeholder="t('common.placeholder.choose') + t('client.fields.refreshTokenTimeToLive')"
            clearable
          >
            <template v-slot:append>分钟</template>
          </el-input>
        </el-form-item>

        <el-form-item
          label-width="120px"
          :label="t('client.fields.authorizationCodeTimeToLive')"
          prop="authorizationCodeTimeToLive"
        >
          <el-input v-model="clientDataForm.tokenSettings.authorizationCodeTimeToLive" autocomplete="off" clearable>
            <template v-slot:append>{{ t('client.fields.minutes') }}</template>
          </el-input>
        </el-form-item>

        <el-form-item
          label-width="120px"
          :label="t('client.fields.accessTokenTimeToLive')"
          prop="accessTokenTimeToLive"
        >
          <el-input v-model="clientDataForm.tokenSettings.accessTokenTimeToLive" autocomplete="off" clearable>
            <template v-slot:append>{{ t('client.fields.minutes') }}</template>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button
        @click="
          () => {
            visible = false
            loading = false
          }
        "
      >
        {{ t('common.cancel') }}
      </el-button>
      <el-button type="primary" :loading="loading" @click="handleClientDataFormSubmit()">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>
