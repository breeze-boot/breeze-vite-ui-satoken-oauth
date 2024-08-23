/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PermissionDatas, ResponseData, UserInfoData } from '@/types/types.ts'

export interface UserLoginForm {
  username?: string
  password?: string
  captchaVerification?: string
}

export interface LoginResponseData {
  access_token: string
  refresh_token: string
  user_info: UserInfoData
  scope: string
  token_type: string
  expires_in: number
}

export interface LogoutResponseData extends ResponseData {
  data: boolean
}

export interface PermissionResponseData extends ResponseData {
  data: PermissionDatas
}
