/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { defineStore } from 'pinia'
import { MsgState } from '@/store/modules/types/types.ts'
import { Client } from '@stomp/stompjs'

const useMsgStore = defineStore('Msg', {
  state: (): MsgState => {
    return {
      stompClient: {} as Client,
    }
  },
  actions: {},
})

export default useMsgStore
