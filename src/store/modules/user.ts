/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { defineStore } from 'pinia'
import { encrypt } from '@/utils/common'
import type { LoginResponseData, UserLoginForm } from '@/api/login/type'
import { type UserState } from './types/types'
import { refreshToken, userLogin } from '@/api/login'
import {
  CLEAR_STORAGE,
  GET_ARRAY_STORAGE,
  GET_OBJ_STORAGE,
  GET_STRING_STORAGE,
  SET_STORAGE,
  SET_STRING_STORAGE,
} from '@/utils/storage'
import { AuthoritiesData, AuthoritiesDatas, GrantType, SALES, StorageName, UserInfoData } from '@/types/types'

/**
 * 过滤出按钮权限
 *
 * @param userInfo
 */
const filterPermissions = (userInfo: UserInfoData): string[] => {
  if (!userInfo) {
    return []
  }
  const PERMISSIONS = [] as string[]

  ;(userInfo.authorities as AuthoritiesDatas).forEach((item: AuthoritiesData) => {
    PERMISSIONS.push(item.authority)
  })
  return PERMISSIONS
}

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      userInfo: GET_OBJ_STORAGE(StorageName.UserInfo) as UserInfoData,
      tenantId: GET_STRING_STORAGE(StorageName.XTenantId) as string,
      refreshToken: GET_STRING_STORAGE(StorageName.RefreshToken) as string,
      accessToken: GET_STRING_STORAGE(StorageName.AccessToken) as string,
      roleCodes: GET_ARRAY_STORAGE(StorageName.RoleCodes) as string[],
      permissions: GET_ARRAY_STORAGE(StorageName.Permissions) as string[],
    }
  },
  actions: {
    /**
     * 用户登录方法
     *
     * @param data 登录参数
     */
    async userLogin(data: UserLoginForm): Promise<LoginResponseData> {
      const LoginForm = {
        username: data.username!.trim() as string,
        password: encrypt(data.password!.trim(), SALES) as string,
        captchaVerification: encodeURIComponent(data.captchaVerification as string),
      }
      const response: any = await userLogin(LoginForm, GrantType.PASSWORD)

      if (response) {
        const { access_token, refresh_token, user_info } = response as LoginResponseData
        // 持久化
        this.userInfo = user_info as UserInfoData
        SET_STORAGE(StorageName.UserInfo, this.userInfo as UserInfoData)

        this.tenantId = user_info.tenantId as string
        SET_STRING_STORAGE(StorageName.XTenantId, this.userInfo.tenantId as string)

        this.refreshToken = refresh_token as string
        SET_STRING_STORAGE(StorageName.RefreshToken, this.refreshToken as string)

        this.accessToken = access_token as string
        SET_STRING_STORAGE(StorageName.AccessToken, this.accessToken as string)

        this.roleCodes = user_info.userRoleCodes as string[]
        SET_STORAGE(StorageName.RoleCodes, this.roleCodes as string[])

        this.permissions = filterPermissions(user_info) as string[]
        SET_STORAGE(StorageName.Permissions, this.permissions as string[])

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
        this.refreshToken = refresh_token as string
        SET_STRING_STORAGE(StorageName.RefreshToken, this.refreshToken as string)

        this.accessToken = access_token as string
        SET_STRING_STORAGE(StorageName.AccessToken, this.accessToken as string)
        return response
      }
      return {} as LoginResponseData
    },
    /**
     * 退出登录
     */
    async logout() {
      this.userInfo = {} as UserInfoData
      this.tenantId = '' as string
      this.accessToken = '' as string
      this.refreshToken = '' as string
      this.permissions = [] as string[]
      this.roleCodes = [] as string[]
      CLEAR_STORAGE()
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
    storeTenantId(tenantId: string) {
      this.tenantId = tenantId
      SET_STRING_STORAGE(StorageName.XTenantId, tenantId)
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
          state.permissions.length > 0 ? state.permissions : (GET_ARRAY_STORAGE(StorageName.Permissions) as string[])
        ) as string[]
      }
    },
  },
})

export default useUserStore
