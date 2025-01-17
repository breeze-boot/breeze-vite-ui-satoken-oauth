/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { defineStore } from 'pinia'
import { encrypt } from '@/utils/common'
import type { EmailLoginForm, LoginResponseData, PhoneLoginForm, UserLoginForm } from '@/api/login/type'
import { type UserState } from './types/types'
import { authEmailLogin, authPhoneLogin, authUserLogin, refreshToken } from '@/api/login'
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

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      userInfo: GET_OBJ_STORAGE(StorageName.UserInfo) as UserInfoData,
      tenantId: CookiesStorage.get(CookiesKey.XTenantId),
      refreshToken: GET_STRING_STORAGE(StorageName.RefreshToken),
      accessToken: GET_STRING_STORAGE(StorageName.AccessToken),
      roleCodes: GET_STR_ARRAY_STORAGE(StorageName.RoleCodes),
      permissions: GET_STR_ARRAY_STORAGE(StorageName.Permissions),
    }
  },
  actions: {
    storage(response: any) {
      const { access_token, refresh_token, user_info } = response as LoginResponseData
      // 持久化
      this.userInfo = user_info as UserInfoData
      SET_OBJ_STORAGE(StorageName.UserInfo, this.userInfo as UserInfoData)

      this.tenantId = user_info.tenantId
      CookiesStorage.set(CookiesKey.XTenantId, this.userInfo.tenantId)

      this.refreshToken = refresh_token
      SET_STRING_STORAGE(StorageName.RefreshToken, this.refreshToken)

      this.accessToken = access_token
      SET_STRING_STORAGE(StorageName.AccessToken, this.accessToken)

      this.roleCodes = user_info.userRoleCodes
      SET_STR_ARRAY_STORAGE(StorageName.RoleCodes, this.roleCodes)

      this.permissions = filterPermissions(user_info)
      SET_STR_ARRAY_STORAGE(StorageName.Permissions, this.permissions)
    },
    /**
     * 用户登录方法
     *
     * @param data 登录参数
     */
    async userLogin(data: UserLoginForm): Promise<LoginResponseData> {
      this.tenantId = data.tenantId
      const response: any = await authUserLogin(
        {
          username: data.username!.trim(),
          captchaVerification: encodeURIComponent(data.captchaVerification),
          password: encrypt(data.password!.trim(), SALES),
        } as UserLoginForm,
        GrantType.PASSWORD,
      )

      if (response) {
        this.storage(response)
        return response
      }
      return {} as LoginResponseData
    },
    /**
     * 邮箱登录方法
     *
     * @param data 登录参数
     */
    async emailLogin(data: EmailLoginForm): Promise<LoginResponseData> {
      this.tenantId = data.tenantId
      const response: any = await authEmailLogin(
        {
          email: data.email!.trim(),
          captchaVerification: encodeURIComponent(data.captchaVerification),
          code: data.code!.trim(),
        } as EmailLoginForm,
        GrantType.EMAIL,
      )

      if (response) {
        this.storage(response)
        return response
      }
      return {} as LoginResponseData
    },
    /**
     * 手机号登录方法
     *
     * @param data 登录参数
     */
    async phoneLogin(data: PhoneLoginForm): Promise<LoginResponseData> {
      this.tenantId = data.tenantId
      const response: any = await authPhoneLogin(
        {
          phone: data.phone!.trim(),
          captchaVerification: encodeURIComponent(data.captchaVerification),
          code: data.code!.trim(),
        } as PhoneLoginForm,
        GrantType.SMS,
      )

      if (response) {
        this.storage(response)
        return response
      }
      return {} as LoginResponseData
    },
    /**
     * token刷新方法
     */
    async toRefreshToken(): Promise<LoginResponseData> {
      if (!this.refreshToken) {
        throw Error('refresh token is null ')
      }
      const response: any = await refreshToken(this.refreshToken, GrantType.REFRESH_TOKEN)
      if (response) {
        const { access_token, refresh_token } = response as LoginResponseData
        // 持久化
        this.refreshToken = refresh_token
        SET_STRING_STORAGE(StorageName.RefreshToken, this.refreshToken)

        this.accessToken = access_token
        SET_STRING_STORAGE(StorageName.AccessToken, this.accessToken)
        return response
      }
      return {} as LoginResponseData
    },
    /**
     * 退出登录
     */
    async logout() {
      this.userInfo = {} as UserInfoData
      this.tenantId = 0
      this.accessToken = '' as string
      this.refreshToken = '' as string
      this.permissions = [] as string[]
      this.roleCodes = [] as string[]
      CookiesStorage.remove(CookiesKey.XTenantId)
    },
    /**
     * 保存登录信息
     */
    storeLoginInfo(refreshToken: string, accessToken: string) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
    },
    /**
     * 保存租户信息
     */
    storeTenantId(tenantId: number) {
      this.tenantId = tenantId
      CookiesStorage.set(CookiesKey.XTenantId, tenantId)
    },
  },
  getters: {
    /**
     * 获取权限信息
     *
     * @param state
     */
    getPermissions: (state: UserState) => {
      return async (): Promise<string[]> => {
        return (
          state.permissions.length > 0 ? state.permissions : GET_STR_ARRAY_STORAGE(StorageName.Permissions)
        ) as string[]
      }
    },
    /**
     * 获取角色信息
     *
     * @param state
     */
    getRoleCodes: (state: UserState) => {
      return async (): Promise<string[]> => {
        return (state.roleCodes.length > 0 ? state.roleCodes : GET_STR_ARRAY_STORAGE(StorageName.RoleCodes)) as string[]
      }
    },
  },
})

export default useUserStore
