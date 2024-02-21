<template>
  <n-loading-bar-provider>
    <n-dialog-provider>
      <dialog-content></dialog-content>
      <loading-content></loading-content>
      <n-notification-provider>
        <n-message-provider>
          <message-content></message-content>
          <slot></slot>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>

<script lang="ts" setup>
import {
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  NLoadingBarProvider
} from 'naive-ui'

import { MessageContent } from '@/components/Plugins/MessageContent'
import { DialogContent } from '@/components/Plugins/DialogContent'
import { LoadingContent } from '@/components/Plugins/LoadingContent'
import {useSystemStore} from "@/store/modules/systemStore/systemStore";
import { SystemStoreEnum, SystemStoreUserInfoEnum } from '@/store/modules/systemStore/systemStore.d'
import { setLocalStorage } from '@/utils'

import { useRoute } from 'vue-router'
const routerParamsInfo = useRoute()
const systemStore = useSystemStore()
console.log(routerParamsInfo, 988)
if (routerParamsInfo && routerParamsInfo.query && routerParamsInfo.query.token) {
  setLocalStorage(SystemStoreUserInfoEnum.USER_TOKEN, routerParamsInfo.query.token)
  systemStore.setItem(SystemStoreEnum.USER_INFO, {
    [SystemStoreUserInfoEnum.USER_TOKEN]: routerParamsInfo.query.token as string,
    [SystemStoreUserInfoEnum.TOKEN_NAME]: routerParamsInfo.query.token as string,
  })
}
</script>
