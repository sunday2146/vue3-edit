<template>
  <preview :key="key"></preview>
</template>

<script setup lang="ts">
import { getSessionStorageInfo } from './utils'
import type { ChartEditStorageType } from './index.d'
import { SavePageEnum } from '@/enums/editPageEnum'
import { setSessionStorage } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'
import { ref } from 'vue'
import Preview from './index.vue'

let key = ref(Date.now())

// 数据变更 -> 组件销毁重建
try {
  const listenerArr = [SavePageEnum.JSON, SavePageEnum.CHART_TO_PREVIEW]
  listenerArr.forEach((saveEvent: string) => {
    if (!window.opener || !window.opener.addEventListener) return
    window.opener.addEventListener(saveEvent, async (e: any) => {
      const localStorageInfo: ChartEditStorageType = (await getSessionStorageInfo()) as unknown as ChartEditStorageType
      setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, [{ ...e.detail, id: localStorageInfo.id }])
      key.value = Date.now()
    })
  })
} catch (error) {
  console.log(error)
}
</script>
