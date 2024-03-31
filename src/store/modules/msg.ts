/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { defineStore } from 'pinia'
import Stomp from 'stompjs'
import { MsgState } from '@/store/modules/types/types.ts'

const useMsgStore = defineStore('Msg', {
  state: (): MsgState => {
    return {
      stompClient: {} as Stomp.Client,
    }
  },
  actions: {},
})

export default useMsgStore
