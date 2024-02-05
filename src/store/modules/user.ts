/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { defineStore } from 'pinia'
import { userLogin } from '@/api/login'
import type { UserLoginForm, LoginResponseData } from '@/api/login/type'
import { type UserState } from './types/types'
import { GET_STORAGE, GET_STRING_STORAGE, REMOVE_STORAGE, SET_STORAGE, SET_STRING_STORAGE } from '@/utils/storage'
import { encrypt } from '@/utils/common'

import {
  AuthoritiesData,
  AuthoritiesDatas,
  AuthorizationData,
  GrantType,
  SALES,
  StorageName,
  UserInfoData,
} from '@/types/types'

/**
 * 过滤出按钮权限
 *
 * @param userInfo
 */
const filterButtons = (userInfo: UserInfoData): string[] => {
  if (!userInfo) {
    return []
  }
  const buttons = [] as string[]

  ;(userInfo.authorities as AuthoritiesDatas).forEach((item: AuthoritiesData) => {
    buttons.push(item.authority)
  })
  return buttons
}

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      authorization: GET_STORAGE(StorageName.Authorization),
      accessToken: GET_STRING_STORAGE(StorageName.AccessToken),
      userInfo: GET_STORAGE(StorageName.UserInfo) as UserInfoData,
      roleCodes: GET_STORAGE(StorageName.RoleCodes) as string[],
      buttons: GET_STORAGE(StorageName.Buttons) as string[],
    }
  },
  actions: {
    /**
     * 用户登录方法
     *
     * @param data 登录参数
     */
    async userLogin(data: UserLoginForm) {
      REMOVE_STORAGE(StorageName.AccessToken)
      const LoginForm = {
        username: data.username!.trim() as string,
        password: encrypt(data.password!.trim(), SALES) as string,
      }
      const response: LoginResponseData = await userLogin(LoginForm, GrantType.PASSWORD)
      if (response) {
        // 持久化
        this.userInfo = response.user_info as UserInfoData
        SET_STORAGE(StorageName.UserInfo, this.userInfo as UserInfoData)
        this.authorization = response as AuthorizationData
        SET_STORAGE(StorageName.Authorization, this.authorization as AuthorizationData)
        this.accessToken = response.access_token as string
        SET_STRING_STORAGE(StorageName.AccessToken, this.accessToken as string)
        this.roleCodes = response.user_info.userRoleCodes as string[]
        SET_STORAGE(StorageName.RoleCodes, this.roleCodes as string[])
        this.buttons = filterButtons(this.userInfo as UserInfoData) as string[]
        SET_STORAGE(StorageName.Buttons, this.buttons as string[])
        return response
      }
    },
    /**
     * 退出登录
     */
    async logout() {
      this.accessToken = ''
      this.userInfo = {} as UserInfoData
      this.authorization = {}
      REMOVE_STORAGE(StorageName.AccessToken)
      REMOVE_STORAGE(StorageName.UserInfo)
      REMOVE_STORAGE(StorageName.Authorization)
    },
  },
  getters: {},
})

export default useUserStore
