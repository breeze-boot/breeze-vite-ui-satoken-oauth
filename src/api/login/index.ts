/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { EmailLoginForm, PhoneLoginForm, UserLoginForm } from './type'
import { GrantType } from '@/types/types.ts'
import { DictResponseData } from '@/api/system/dict/type.ts'
import { AxiosPromise } from 'axios'

enum API {
  AUTH_URL = '/oauth2/token',
  EMAIL_CODE_URL = '/oauth2/sendEmailCode',
  PHONE_CODE_URL = '/oauth2/sendPhoneCode',
  LOGOUT_URL = '/logout',
}

/**
 * auth用户名登录
 *
 * @param loginData 登录提交参数
 * @param grantType 登录类型
 */
export const authUserLogin = (loginData: UserLoginForm, grantType: GrantType) =>
  request.post<any, any>(
    API.AUTH_URL +
      `?grant_type=${grantType}&username=${loginData.username}&password=${loginData.password}&scope=user_info&captchaVerification=${loginData.captchaVerification}`,
    {},
    {
      headers: {
        Authorization: 'Basic YnJlZXplOmJyZWV6ZQ==',
        withCredentials: true,
      },
    },
  )

/**
 * auth邮箱登录
 *
 * @param loginData 登录提交参数
 * @param grantType 登录类型
 */
export const authEmailLogin = (loginData: EmailLoginForm, grantType: GrantType) =>
  request.post<any, any>(
    API.AUTH_URL +
      `?grant_type=${grantType}&email=${loginData.email}&code=${loginData.code}&scope=user_info&captchaVerification=${loginData.captchaVerification}`,
    {},
    {
      headers: {
        Authorization: 'Basic YnJlZXplOmJyZWV6ZQ==',
        withCredentials: true,
      },
    },
  )
/**
 * auth手机号登录
 *
 * @param loginData 登录提交参数
 * @param grantType 登录类型
 */
export const authPhoneLogin = (loginData: PhoneLoginForm, grantType: GrantType) =>
  request.post<any, any>(
    API.AUTH_URL +
      `?grant_type=${grantType}&phone=${loginData.phone}&code=${loginData.code}&scope=user_info&captchaVerification=${loginData.captchaVerification}`,
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
 * 获取邮箱验证码
 *
 * @param email
 */
export function sendEmailCode(email: string): AxiosPromise<DictResponseData> {
  return request({
    url: API.EMAIL_CODE_URL,
    method: 'get',
    params: {
      email,
    },
  })
}

/**
 * 获取手机号验证码
 *
 * @param phone
 */
export function sendPhoneCode(phone: string): AxiosPromise<DictResponseData> {
  return request({
    url: API.PHONE_CODE_URL,
    method: 'get',
    params: {
      phone,
    },
  })
}

/**
 * 退出登录
 */
export const logout = () => request.get<any, any>(API.LOGOUT_URL)
