/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { ref } from 'vue'
import { defineStore, StoreDefinition } from 'pinia'
import { LoginState } from './types/types'
import { GET_STRING_STORAGE, SET_STRING_STORAGE } from '@/utils/storage'
import { StorageName } from '@/types/types'

const useLoginStore: StoreDefinition<'Login', LoginState> = defineStore('Login', () => {
  // 状态定义
  const phone = ref<string>(GET_STRING_STORAGE(StorageName.Phone) || '')
  const email = ref<string>(GET_STRING_STORAGE(StorageName.Email) || '')
  const phoneCountDown = ref<string>(GET_STRING_STORAGE(StorageName.PhoneCountDown) || '')
  const emailCountDown = ref<string>(GET_STRING_STORAGE(StorageName.EmailCountDown) || '')

  // 存储手机号倒计时
  const storagePhoneCountDown = (count: number) => {
    phoneCountDown.value = count.toString()
    SET_STRING_STORAGE(StorageName.PhoneCountDown, phoneCountDown.value)
  }

  // 存储手机号
  const storagePhone = (phoneNum: string) => {
    phone.value = phoneNum
    SET_STRING_STORAGE(StorageName.Phone, phone.value)
  }

  // 存储邮箱倒计时
  const storageEmailCountDown = (count: number) => {
    emailCountDown.value = count.toString()
    SET_STRING_STORAGE(StorageName.EmailCountDown, emailCountDown.value)
  }

  // 存储邮箱（修正：原代码错误地存储到了Phone键）
  const storageEmail = (emailAddr: string) => {
    email.value = emailAddr
    SET_STRING_STORAGE(StorageName.Email, email.value) // 修正键名
  }

  return {
    // 状态
    phone,
    email,
    phoneCountDown,
    emailCountDown,

    // 方法
    storagePhoneCountDown,
    storagePhone,
    storageEmailCountDown,
    storageEmail,
  }
})

export default useLoginStore
