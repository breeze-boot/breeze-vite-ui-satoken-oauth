/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { defineStore, StoreDefinition } from 'pinia'
import { ref, computed, type Ref } from 'vue'
import { encrypt } from '@/utils/common'
import type { EmailLoginForm, LoginResponseData, PhoneLoginForm, UserLoginForm } from '@/api/login/type'
import type { UserState } from './types/types'
import { authEmailLoginAPI, authPhoneLoginAPI, authUserLoginAPI, refreshTokenAPI } from '@/api/login'
import {
  GET_OBJ_STORAGE,
  GET_STR_ARRAY_STORAGE,
  GET_STRING_STORAGE,
  SET_OBJ_STORAGE,
  SET_STR_ARRAY_STORAGE,
  SET_STRING_STORAGE,
} from '@/utils/storage'
import { AuthoritiesData, AuthoritiesDatas, GrantType, SALES, StorageName, UserInfoData } from '@/types/types'
import { CookiesKey, CookiesStorage } from '@/utils/cookies.ts'

/**
 * 过滤出按钮权限
 *
 * @param userInfo
 */
const filterPermissions = (userInfo: UserInfoData): string[] => {
  if (!userInfo) {
    return []
  }
  const PERMISSIONS: string[] = []

  ;(userInfo.authorities as AuthoritiesDatas).forEach((item: AuthoritiesData) => {
    PERMISSIONS.push(item.authority)
  })
  return PERMISSIONS
}

const useUserStore: StoreDefinition<'User', UserState> = defineStore('User', () => {
  // 状态定义
  const userInfo: Ref<UserInfoData> = ref(GET_OBJ_STORAGE(StorageName.UserInfo) as UserInfoData)
  const tenantId: Ref<number | null> = ref(CookiesStorage.get(CookiesKey.XTenantId))
  const refreshToken: Ref<string> = ref(GET_STRING_STORAGE(StorageName.RefreshToken))
  const accessToken: Ref<string> = ref(GET_STRING_STORAGE(StorageName.AccessToken))
  const roleCodes: Ref<string[]> = ref(GET_STR_ARRAY_STORAGE(StorageName.RoleCodes))
  const permissions: Ref<string[]> = ref(GET_STR_ARRAY_STORAGE(StorageName.Permissions))

  // 持久化存储方法
  const storage = (response: any) => {
    const { access_token, refresh_token, user_info } = response as LoginResponseData

    userInfo.value = user_info as UserInfoData
    SET_OBJ_STORAGE(StorageName.UserInfo, userInfo.value)

    tenantId.value = user_info.tenantId
    CookiesStorage.set(CookiesKey.XTenantId, userInfo.value.tenantId)

    refreshToken.value = refresh_token
    SET_STRING_STORAGE(StorageName.RefreshToken, refreshToken.value)

    accessToken.value = access_token
    SET_STRING_STORAGE(StorageName.AccessToken, accessToken.value)

    roleCodes.value = user_info.userRoleCodes
    SET_STR_ARRAY_STORAGE(StorageName.RoleCodes, roleCodes.value)

    permissions.value = filterPermissions(user_info)
    SET_STR_ARRAY_STORAGE(StorageName.Permissions, permissions.value)
  }

  // 用户登录方法
  const userLogin = async (data: UserLoginForm): Promise<LoginResponseData> => {
    tenantId.value = data.tenantId
    const response: any = await authUserLoginAPI(
      {
        username: data.username!.trim(),
        captchaVerification: encodeURIComponent(data.captchaVerification),
        password: encrypt(data.password!.trim(), SALES),
      } as UserLoginForm,
      GrantType.PASSWORD,
    )

    if (response) {
      storage(response)
      return response
    }
    return {} as LoginResponseData
  }

  // 邮箱登录方法
  const emailLogin = async (data: EmailLoginForm): Promise<LoginResponseData> => {
    tenantId.value = data.tenantId
    const response: any = await authEmailLoginAPI(
      {
        email: data.email!.trim(),
        captchaVerification: encodeURIComponent(data.captchaVerification),
        code: data.code!.trim(),
      } as EmailLoginForm,
      GrantType.EMAIL,
    )

    if (response) {
      storage(response)
      return response
    }
    return {} as LoginResponseData
  }

  // 手机号登录方法
  const phoneLogin = async (data: PhoneLoginForm): Promise<LoginResponseData> => {
    tenantId.value = data.tenantId
    const response: any = await authPhoneLoginAPI(
      {
        phone: data.phone!.trim(),
        captchaVerification: encodeURIComponent(data.captchaVerification),
        code: data.code!.trim(),
      } as PhoneLoginForm,
      GrantType.SMS,
    )

    if (response) {
      storage(response)
      return response
    }
    return {} as LoginResponseData
  }

  // token刷新方法
  const toRefreshToken = async (): Promise<LoginResponseData> => {
    if (!refreshToken.value) {
      throw Error('refresh token is null ')
    }
    const response: any = await refreshTokenAPI(refreshToken.value, GrantType.REFRESH_TOKEN)
    if (response) {
      const { access_token, refresh_token } = response as LoginResponseData

      refreshToken.value = refresh_token
      SET_STRING_STORAGE(StorageName.RefreshToken, refreshToken.value)

      accessToken.value = access_token
      SET_STRING_STORAGE(StorageName.AccessToken, accessToken.value)
      return response
    }
    return {} as LoginResponseData
  }

  // 退出登录
  const logout = async () => {
    userInfo.value = {} as UserInfoData
    SET_OBJ_STORAGE(StorageName.UserInfo, userInfo.value)

    accessToken.value = ''
    SET_STRING_STORAGE(StorageName.AccessToken, accessToken.value)

    refreshToken.value = ''
    SET_STRING_STORAGE(StorageName.RefreshToken, refreshToken.value)

    permissions.value = []
    SET_STR_ARRAY_STORAGE(StorageName.Permissions, permissions.value)

    roleCodes.value = []
    SET_STR_ARRAY_STORAGE(StorageName.RoleCodes, roleCodes.value)

    tenantId.value = null
    CookiesStorage.remove(CookiesKey.XTenantId)
  }

  // 保存登录信息
  const storeLoginInfo = (_refreshToken: string, _accessToken: string) => {
    accessToken.value = _accessToken
    refreshToken.value = _refreshToken
  }

  // 保存租户信息
  const storeTenantId = (_tenantId: number) => {
    tenantId.value = _tenantId
    CookiesStorage.set(CookiesKey.XTenantId, tenantId)
  }

  // 计算属性
  const userPermissions = computed(() => {
    return GET_STR_ARRAY_STORAGE(StorageName.Permissions)
  })

  const userRoleCodes = computed(() => {
    return GET_STR_ARRAY_STORAGE(StorageName.RoleCodes)
  })

  return {
    // 状态
    userInfo,
    tenantId,
    refreshToken,
    accessToken,
    roleCodes,
    permissions,

    // Getters
    userPermissions,
    userRoleCodes,

    // Actions
    userLogin,
    emailLogin,
    phoneLogin,
    toRefreshToken,
    logout,
    storeLoginInfo,
    storeTenantId,
  }
})

export default useUserStore
