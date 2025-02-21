/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PermissionDatas, ResponseData, UserInfoData } from '@/types/types.ts'

export interface LoginForm {
  tenantId: number
  captchaVerification: string
}

export interface UserLoginForm extends LoginForm {
  username: string
  password: string
}

export interface EmailLoginForm extends LoginForm {
  email: string
  code: string
}

export interface PhoneLoginForm extends LoginForm {
  phone: string
  code: string
}

export interface UserLoginForm {
  username: string
  password: string
  tenantId: number
  captchaVerification: string
}

export interface LoginResponseData {
  access_token: string
  refresh_token: string
  user_info: UserInfoData
  scope: string
  token_type: string
  expires_in: number
}

export interface PermissionResponseData extends ResponseData {
  data: PermissionDatas
}
