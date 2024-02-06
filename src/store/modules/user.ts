/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { defineStore } from 'pinia'
import { encrypt } from '@/utils/common'
import type { LoginResponseData, UserLoginForm } from '@/api/login/type'
import { type UserState } from './types/types'
import { refreshToken, userLogin } from '@/api/login'
import { CLEAR_STORAGE, GET_STORAGE, GET_STRING_STORAGE, SET_STORAGE, SET_STRING_STORAGE } from '@/utils/storage'
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
      userInfo: GET_STORAGE(StorageName.UserInfo) as UserInfoData,
      refreshToken: GET_STRING_STORAGE(StorageName.RefreshToken) as string,
      accessToken: GET_STRING_STORAGE(StorageName.AccessToken) as string,
      roleCodes: GET_STORAGE(StorageName.RoleCodes) as string[],
      permissions: GET_STORAGE(StorageName.Permissions) as string[],
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
      }
      const response: LoginResponseData = await userLogin(LoginForm, GrantType.PASSWORD)
      if (response) {
        // 持久化
        this.userInfo = response.user_info as UserInfoData
        SET_STORAGE(StorageName.UserInfo, this.userInfo as UserInfoData)

        this.refreshToken = response.refresh_token as string
        SET_STRING_STORAGE(StorageName.RefreshToken, this.refreshToken as string)

        this.accessToken = response.access_token as string
        SET_STRING_STORAGE(StorageName.AccessToken, this.accessToken as string)

        this.roleCodes = response.user_info.userRoleCodes as string[]
        SET_STORAGE(StorageName.RoleCodes, this.roleCodes as string[])

        this.permissions = filterPermissions(this.userInfo as UserInfoData) as string[]
        SET_STORAGE(StorageName.Permissions, this.permissions as string[])

        return response
      }
      return {} as LoginResponseData
    },
    /**
     * token刷新方法
     */
    async toRefreshToken(): Promise<LoginResponseData> {
      // this.accessToken = '401'
      const response: LoginResponseData = await refreshToken(this.refreshToken, GrantType.REFRESH_TOKEN)
      if (response) {
        // 持久化
        this.refreshToken = response.refresh_token as string
        SET_STRING_STORAGE(StorageName.RefreshToken, this.refreshToken as string)

        this.accessToken = response.access_token as string
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
      this.accessToken = '' as string
      this.refreshToken = '' as string
      this.permissions = [] as string[]
      this.roleCodes = [] as string[]
      CLEAR_STORAGE()
    },
  },
  getters: {},
})

export default useUserStore
