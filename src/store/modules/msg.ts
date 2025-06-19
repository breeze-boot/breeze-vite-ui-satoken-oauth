/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */

import { ref } from 'vue'
import { defineStore, StoreDefinition } from 'pinia'
import { Client } from '@stomp/stompjs'
import type { MsgState } from '@/store/modules/types/types.ts'

const useMsgStore: StoreDefinition<'Msg', MsgState> = defineStore('Msg', () => {
  // 定义响应式状态
  const stompClient = ref<Client>({} as Client)

  return {
    // 状态
    stompClient,

    // 方法
  }
})

export default useMsgStore
