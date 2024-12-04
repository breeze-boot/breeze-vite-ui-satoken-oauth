/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { UserLoginForm } from './type'
import { GrantType } from '@/types/types.ts'

enum API {
  AUTH_URL = '/oauth2/token',
  LOGOUT_URL = '/logout',
}

/**
 * 用户登录
 *
 * @param userLoginForm 用户登录提交参数
 * @param grantType     登录类型
 */
export const userLogin = (userLoginForm: UserLoginForm, grantType: GrantType) =>
  request.post<any, any>(
    API.AUTH_URL +
      `?grant_type=${grantType}&username=${userLoginForm.username}&password=${userLoginForm.password}&scope=user_info&captchaVerification=${userLoginForm.captchaVerification}`,
    {},
    {
      headers: {
        Authorization: 'Basic YnJlZXplOmJyZWV6ZQ==',
        withCredentials: true,
      },
    },
  )

/**
 * TOKEN刷新
 *
 * @param refreshToken 刷新token
 * @param grantType    登录类型
 */
export const refreshToken = (refreshToken: string, grantType: GrantType) =>
  request.post<any, any>(
    API.AUTH_URL + `?grant_type=${grantType}&refresh_token=${refreshToken}`,
    {},
    {
      headers: {
        Authorization: 'Basic YnJlZXplOmJyZWV6ZQ==',
      },
    },
  )

/**
 * 退出登录
 */
export const logout = () => request.get<any, any>(API.LOGOUT_URL)
