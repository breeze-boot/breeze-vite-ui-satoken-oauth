/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { defineStore } from 'pinia'
import { LoginState } from './types/types'
import { GET_STRING_STORAGE, SET_STRING_STORAGE } from '@/utils/storage'
import { StorageName } from '@/types/types'

const useLoginStore = defineStore('Login', {
  state: (): LoginState => {
    return {
      phone: GET_STRING_STORAGE(StorageName.Phone),
      email: GET_STRING_STORAGE(StorageName.Email),
      phoneCountDown: GET_STRING_STORAGE(StorageName.PhoneCountDown),
      emailCountDown: GET_STRING_STORAGE(StorageName.EmailCountDown),
    }
  },
  actions: {
    storagePhoneCountDown(count: number) {
      SET_STRING_STORAGE(StorageName.PhoneCountDown, count.toString())
    },
    storagePhone(phone: string) {
      SET_STRING_STORAGE(StorageName.Phone, phone)
    },
    storageEmailCountDown(count: number) {
      SET_STRING_STORAGE(StorageName.EmailCountDown, count.toString())
    },
    storageEmail(email: string) {
      SET_STRING_STORAGE(StorageName.Phone, email)
    },
  },
  getters: {},
})

export default useLoginStore
