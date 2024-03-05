<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 客户端添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addClient, getClient, editClient, checkClientCode } from '@/api/auth/client'
import { ClientRecord } from '@/api/auth/client/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import { useDict } from '@/hooks/dict'

defineOptions({
  name: 'ClientAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref(false)
const clientDataFormRef = ref()
const clientDataForm = ref<ClientRecord>({
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
  clientCode: [
    {
      required: true,
      message: t('client.rules.clientCode'),
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        checkClientCode(value, !clientDataForm.value.id ? undefined : JSONBigInt.parse(clientDataForm.value.id)).then(
          (response: any) => {
            if (response.data) {
              callback()
              return
            }
            callback(new Error(t('client.rules.clientCodeExists')))
          },
        )
      },
      trigger: 'blur',
    },
  ],
  clientName: [
    {
      required: true,
      message: t('client.rules.clientName'),
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
  visible.value = true
  clientDataForm.value.id = undefined
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
    const id = clientDataForm.value.id
    if (id) {
      await editClient(clientDataForm.value)
      ElMessage.success({
        message: t('common.success'),
        duration: 500,
        onClose: () => {
          visible.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addClient(clientDataForm.value)
      ElMessage.success({
        message: t('common.success'),
        duration: 500,
        onClose: () => {
          visible.value = false
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
    width="38%"
    :title="!clientDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="clientDataForm"
      :rules="rules"
      ref="clientDataFormRef"
      @keyup.enter="handleClientDataFormSubmit()"
      label-width="125px"
    >
      <div class="card">
        <span>基础配置</span>
        <el-divider />
        <el-form-item label-width="100px" label="客户端ID" prop="clientId">
          <el-input v-model="clientDataForm.clientId" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label-width="100px" label="客户端名称" prop="clientName">
          <el-input v-model="clientDataForm.clientName" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item
          label-width="100px"
          label="密钥"
          prop="clientSecret"
          v-if="!clientDataForm.id && !clientDataForm.clientSettings.requireProofKey"
        >
          <el-input v-model="clientDataForm.clientSecret" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item
          label-width="100px"
          label="确认密钥"
          prop="confirmClientSecret"
          v-if="!clientDataForm.id && !clientDataForm.clientSettings.requireProofKey"
        >
          <el-input v-model="clientDataForm.confirmClientSecret" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label-width="100px" label="发布日期" prop="clientIdIssuedAt">
          <el-date-picker
            v-model="clientDataForm.clientIdIssuedAt"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择发布日期 "
            default-time="12:00:00"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label-width="100px" label="重定向URI" prop="redirectUris">
          <el-select
            filterable
            allow-create
            default-first-option
            multiple
            v-model="clientDataForm.redirectUris"
            placeholder="请设置重定向URI"
          >
            <el-option
              v-for="(item, index) in REDIRECT_URIS"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="100px" label="权限范围" prop="scopes">
          <el-select filterable multiple v-model="clientDataForm.scopes" placeholder="请选择权限范围">
            <el-option v-for="(item, index) in SCOPES" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="100px" label="授权许可类型" prop="authorizationGrantTypes">
          <el-select
            filterable
            multiple
            v-model="clientDataForm.authorizationGrantTypes"
            placeholder="请选择授权许可类型"
          >
            <el-option
              v-for="(item, index) in AUTHORIZATION_GRANT_TYPES"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="100px" label="身份验证方法" prop="clientAuthenticationMethods">
          <el-select
            filterable
            multiple
            v-model="clientDataForm.clientAuthenticationMethods"
            placeholder="请选择身份验证方法"
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
          label-width="100px"
          label="密钥到期时间"
          prop="clientSecretExpiresAt"
          v-if="!clientDataForm.clientSettings.requireProofKey"
        >
          <el-date-picker
            v-model="clientDataForm.clientSecretExpiresAt"
            type="datetime"
            placeholder="选择密钥到期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="12:00:00"
          ></el-date-picker>
        </el-form-item>
      </div>

      <div class="card">
        <span>client配置</span>
        <el-divider />
        <el-form-item label-width="100px" label="PKCE" prop="requireProofKey">
          <el-switch
            v-model="clientDataForm.clientSettings.requireProofKey"
            :active-value="true"
            :inactive-value="false"
            active-color="#13ce66"
            inactive-color="#AAAAAA"
          ></el-switch>
        </el-form-item>

        <el-form-item label-width="100px" label="授权同意页面" prop="requireAuthorizationConsent">
          <el-switch
            v-model="clientDataForm.clientSettings.requireAuthorizationConsent"
            :active-value="true"
            :inactive-value="false"
            active-color="#13ce66"
            inactive-color="#AAAAAA"
          ></el-switch>
        </el-form-item>

        <el-form-item label-width="100px" label="JWK-URL" prop="jwkSetUrl">
          <el-input
            v-model="clientDataForm.clientSettings.jwkSetUrl"
            autocomplete="off"
            clearable
            placeholder="请输入JWT获取URL"
          />
        </el-form-item>

        <el-form-item label-width="100px" label="JWT签名算法" prop="tokenEndpointAuthenticationSigningAlgorithm">
          <el-select
            v-model="clientDataForm.clientSettings.tokenEndpointAuthenticationSigningAlgorithm"
            placeholder="请选择JWT的签名算法"
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
        <span>token配置</span>
        <el-divider />
        <el-form-item label-width="100px" label="ID-TOKEN签名算法" prop="idTokenSignatureAlgorithm">
          <el-select
            v-model="clientDataForm.tokenSettings.idTokenSignatureAlgorithm"
            placeholder="请选择ID-TOKEN签名算法"
          >
            <el-option
              v-for="(item, index) in ID_TOKEN_SIGNATURE_ALGORITHM"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="100px" label="访问令牌格式" prop="accessTokenFormat">
          <el-select v-model="clientDataForm.tokenSettings.accessTokenFormat" placeholder="请选择访问令牌格式">
            <el-option
              v-for="(item, index) in ACCESS_TOKEN_FORMAT"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="100px" label="刷新令牌" prop="reuseRefreshTokens">
          <el-switch
            v-model="clientDataForm.tokenSettings.reuseRefreshTokens"
            :active-value="true"
            :inactive-value="false"
            active-color="#13ce66"
            inactive-color="#AAAAAA"
          ></el-switch>
        </el-form-item>

        <el-form-item
          label-width="100px"
          label="刷新令牌有效时间"
          prop="refreshTokenTimeToLive"
          v-if="clientDataForm.tokenSettings.reuseRefreshTokens"
        >
          <el-input v-model="clientDataForm.tokenSettings.refreshTokenTimeToLive" autocomplete="off" clearable>
            <template v-slot:append>分钟</template>
          </el-input>
        </el-form-item>

        <el-form-item label-width="100px" label="授权代码有效时间" prop="authorizationCodeTimeToLive">
          <el-input v-model="clientDataForm.tokenSettings.authorizationCodeTimeToLive" autocomplete="off" clearable>
            <template v-slot:append>分钟</template>
          </el-input>
        </el-form-item>

        <el-form-item label-width="100px" label="访问令牌有效时间" prop="accessTokenTimeToLive">
          <el-input v-model="clientDataForm.tokenSettings.accessTokenTimeToLive" autocomplete="off" clearable>
            <template v-slot:append>分钟</template>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleClientDataFormSubmit()">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
