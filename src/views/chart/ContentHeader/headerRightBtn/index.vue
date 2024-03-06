<template>
  <n-space class="go-mt-0">
    <n-button v-for="item in comBtnList" :key="item.key" :type="item.type()" ghost @click="item.event">
      <template #icon>
        <component :is="item.icon"></component>
      </template>
      <span>{{ item.title() }}</span>
    </n-button>
  </n-space>

  <!-- 发布管理弹窗 -->
  <n-modal v-model:show="modelShow" @afterLeave="closeHandle" title="保存并插播" preset="dialog" style="width: 600px">
    <n-space vertical>
      <n-space :size="10">
        <n-text @click="handleFocusFacilityName">设备终端：</n-text>
        <div>
          <n-input ref="inputFacilityNameRef" v-model:value="facilityName" type="text" placeholder="请输入设备名称" >
            <template #suffix>
              <n-icon :component="SearchIcon" />
            </template>
          </n-input>
        </div>
        <n-select v-model:value="selectedOption" :options="optionsDeviceState" style="width: 90px" />
        <n-button quaternary type="primary" @click="refreshFacility">
          刷新
        </n-button>
      </n-space>
      <n-space>
        <n-tree :data="filterTreeData" node-key="id" checkable @update:checked-keys="currentNodeKey"
                children-field="deviceList" label-field="name"
                @check-on-click="handleNodeClick" :default-checked-keys="expandedKeys" ref="tree" check-strictly default-expand-all>

        </n-tree>
      </n-space>
      <n-space :size="10">
        <n-text class="item-left">播放时长：</n-text>
        <n-space vertical>
          <n-radio-group v-model:value="playDurationMode">
            <n-space>
              <n-radio value="times"> 节目次数 </n-radio>
              <n-radio value="DURATION"> 自定义时长 </n-radio>
            </n-space>
          </n-radio-group>
          <n-input-number v-model:value="times" v-show="playDurationMode == 'times'" button-placement="both" min="1" max="255" />
          <n-input v-model:value="minutes" v-show="playDurationMode == 'DURATION'" button-placement="both" min="1" max="255" />
        </n-space>
      </n-space>
      <n-space :size="10">
        <n-button @click="modelShowHandle">取消</n-button>
        <n-button @click="modelShowHandle" type="info">保存并插播</n-button>
      </n-space>
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import {ref, computed, watchEffect, onMounted, reactive, nextTick, h} from 'vue'
import { useRoute } from 'vue-router'
import { useClipboard } from '@vueuse/core'
import { PreviewEnum } from '@/enums/pageEnum'
import { StorageEnum } from '@/enums/storageEnum'
import { ResultEnum } from '@/enums/httpEnum'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { syncData } from '../../ContentEdit/components/EditTools/hooks/useSyncUpdate.hook'
import { useSync } from '../../hooks/useSync.hook'
import { ProjectInfoEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import {changeProjectReleaseApi, getFacilityListApi} from '@/api/path'
import {
  previewPath,
  renderIcon,
  fetchPathByName,
  routerTurnByPath,
  setSessionStorage,
  getLocalStorage,
  httpErrorHandle,
  fetchRouteParamsLocation
} from '@/utils'
import { optionsDeviceState} from "@/enums/configForm";
import { icon } from '@/plugins'
import { cloneDeep } from 'lodash'
import {NInput, useDialog} from 'naive-ui'

const dialog = useDialog()
const { dataSyncUpdate } = useSync()
const { BrowsersOutlineIcon, SendIcon, AnalyticsIcon, CloseIcon, SearchIcon } = icon.ionicons5
const { SaveIcon } = icon.carbon
const chartEditStore = useChartEditStore()

const previewPathRef = ref(previewPath())
const { copy, isSupported } = useClipboard({ source: previewPathRef })

const routerParamsInfo = useRoute()

const modelShow = ref<boolean>(false)
const release = ref<boolean>(false)
const filterTreeData = ref<any>([])
const expandedKeys = ref([])
const currentNodeKey = ref('')
const selectedOption = ref<string>('All')
const facilityName = ref<string>('')
const playDurationMode = ref<string>('times')
const times = ref<number>(1)
const minutes = ref<string>('00:00:15')

const inputFacilityNameRef = ref(null)

watchEffect(() => {
  release.value = chartEditStore.getProjectInfo.release || false
})

const formInline = reactive({
  username: 'admin',
  password: 'admin',
})
const getFacilityList = async () => {
  try {
    await getFacilityListApi({deviceTypeCode: 'AdvertisingScreen', deviceTypeEnum: 'IOTDEVICE', groupType: 'COMMON'}).then((result: any) => {
      const allNode = [{
        id: 'all',
        name: '全部',
        offlineNum: 0,
        onlineNum: 0,
        groupType: "COMMON",
        deviceList: [] // 这里可以包含所有的设备
      }]
      result.data.map((deviceGroup: any) => {
        allNode[0].deviceList = allNode[0].deviceList.concat(deviceGroup)
        allNode[0].offlineNum += deviceGroup.offlineNum
        allNode[0].onlineNum += deviceGroup.onlineNum
      })
      filterTreeData.value = allNode
      console.log(result, 9998)
    })
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  getFacilityList();
});

// 关闭弹窗
const closeHandle = () => {
  modelShow.value = false
}

const refreshFacility = () => {
  getFacilityList()
}

const handleNodeClick = () => {
  console.log('点击树节点data')
}
// 预览
const previewHandle = () => {
  const path = fetchPathByName(PreviewEnum.CHART_PREVIEW_NAME, 'href')
  if (!path) return
  const { id } = routerParamsInfo.params
  // id 标识
  const previewId = typeof id === 'string' ? id : id[0]
  const storageInfo = chartEditStore.getStorageInfo()
  const sessionStorageInfo = getLocalStorage(StorageEnum.GO_CHART_STORAGE_LIST) || []

  if (sessionStorageInfo?.length) {
    const repeateIndex = sessionStorageInfo.findIndex((e: { id: string }) => e.id === previewId)
    // 重复替换
    if (repeateIndex !== -1) {
      sessionStorageInfo.splice(repeateIndex, 1, {
        id: previewId,
        ...storageInfo
      })
      setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo)
    } else {
      sessionStorageInfo.push({
        id: previewId,
        ...storageInfo
      })
      setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo)
    }
  } else {
    setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, [{ id: previewId, ...storageInfo }])
  }
  // 跳转
  routerTurnByPath(path, [previewId], undefined, true)
}

const handleFocusFacilityName = () => {
  nextTick(() => {
    inputFacilityNameRef.value && (inputFacilityNameRef.value as any).focus()
  })
}
// 模态弹窗
const modelShowHandle = () => {
  // dialog.create({title: '成功',
  //   content: () => {
  //     return h(NInput, { value: facilityName.value})
  //   },
  //   positiveText: '哇',
  //   onPositiveClick: () => {
  //   console.log(12123)
  //   }})
  // // nextTick(() => {
  // //   inputFacilityNameRef.value && (inputFacilityNameRef.value as any).focus()
  // // })
  modelShow.value = !modelShow.value
}

// 复制预览地址
const copyPreviewPath = (successText?: string, failureText?: string) => {
  if (isSupported) {
    copy()
    window['$message'].success(successText || '复制成功！')
  } else {
    window['$message'].error(failureText || '复制失败！')
  }
}

// 发布
const sendHandle = async () => {
  const res = await changeProjectReleaseApi({
    id: fetchRouteParamsLocation(),
    // 反过来
    state: release.value ? -1 : 1
  })

  if (res && res.code === ResultEnum.SUCCESS) {
    modelShowHandle()
    if (!release.value) {
      copyPreviewPath('发布成功！已复制地址到剪贴板~', '发布成功！')
    } else {
      window['$message'].success(`已取消发布`)
    }
    chartEditStore.setProjectInfo(ProjectInfoEnum.RELEASE, !release.value)
  } else {
    httpErrorHandle()
  }
}

const btnList = [
  {
    select: true,
    title: () => '同步内容',
    type: () => 'primary',
    icon: renderIcon(AnalyticsIcon),
    event: syncData
  },
  {
    key: 'preview',
    title: () => '预览',
    type: () => 'default',
    icon: renderIcon(BrowsersOutlineIcon),
    event: previewHandle
  },
  // {
  //   key: 'release',
  //   title: () => (release.value ? '已发布' : '发布'),
  //   icon: renderIcon(SendIcon),
  //   type: () => (release.value ? 'primary' : 'default'),
  //   event: modelShowHandle
  // },
  {
    key: 'save',
    title: () => '保存',
    type: () => 'default',
    icon: renderIcon(SaveIcon),
    event: dataSyncUpdate(false)
  },
  {
    key: 'save',
    title: () => '存为模板',
    type: () => 'default',
    icon: renderIcon(SaveIcon),
    event: dataSyncUpdate(true)
  },
  {
    key: 'save',
    title: () => '保存并插播',
    type: () => 'default',
    icon: renderIcon(SendIcon),
    event: modelShowHandle
  }
]

const comBtnList = computed(() => {
  if (chartEditStore.getEditCanvas.isCodeEdit) {
    return btnList
  }
  const cloneList = cloneDeep(btnList)
  cloneList.shift()
  return cloneList
})
</script>

<style lang="scss" scoped>
@include go('system-setting') {
  @extend .go-background-filter;
  min-width: 100px;
  max-width: 60vw;
  padding-bottom: 20px;
  @include deep() {
    .n-list-item:not(:last-child) {
      border-bottom: 0;
    }
  }
}
</style>
