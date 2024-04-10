<template>
  <n-space class="go-mt-0">
    <n-button round v-for="item in comBtnList" :key="item.key" :type="item.type()" ghost @click="item.event">
      <template #icon>
        <component :is="item.icon"></component>
      </template>
      <span>{{ item.title() }}</span>
    </n-button>
  </n-space>

  <!-- 发布管理弹窗 -->
  <n-modal v-model:show="modelShow" @afterLeave="closeHandle" title="保存并插播" preset="dialog" style="width: 840px">
    <n-space vertical>
      <n-space :size="10" class="deviceTitle">
        <n-text>设备终端：</n-text>
        <div>
          <n-input round style="width:410px" v-model:value="facilityName" type="text" placeholder="请输入设备名称">
            <template #suffix>
              <n-icon :component="SearchIcon" />
            </template>
          </n-input>
        </div>
        <n-select round v-model:value="selectedOption" :options="optionsDeviceState" @change="filterDevices"
          style="width: 90px" />

        <n-select round style="width:100px;margin-left: 10px;" v-model:value="sizeTypeOption" @change="proSizeChange"
          :options="typeOptions" />

        <n-button quaternary type="info" @click="refreshFacility">
          刷新
        </n-button>
      </n-space>
      <n-space class="deviceTreee">
        <n-tree :data="filterTreeData" @update:checked-keys="updateCheckedKeys" :checked-keys="checkedKeys"
          class="deviceListTree" :pattern="facilityName" children-field="deviceList" label-field="name" key-field="id"
          :render-prefix="renderPrefix" :render-label="renderLabel" :show-irrelevant-nodes="false" expand-on-click
          checkable default-expand-all check-strategy="parent">
        </n-tree>
      </n-space>
      <n-space :size="10">
        <n-text class="item-left">播放时长：</n-text>
        <n-space vertical>
          <n-radio-group round v-model:value="playDurationMode">
            <n-space>
              <n-radio value="times"> 节目次数 </n-radio>
              <n-radio value="DURATION"> 自定义时长 </n-radio>
            </n-space>
          </n-radio-group>
          <n-input-number round v-model:value="times" v-show="playDurationMode == 'times'" button-placement="both"
            min="1" max="255" />
          <n-input round v-model:value="minutes" v-show="playDurationMode == 'DURATION'" button-placement="both" min="1"
            max="255" />
        </n-space>
      </n-space>
      <n-space justify="end">
        <n-button round @click="modelShowHandle">取消</n-button>
        <n-button round @click="savePlayer" type="info">保存并插播</n-button>
      </n-space>
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, reactive, nextTick, h } from 'vue'
import { useRoute } from 'vue-router'
import { useClipboard } from '@vueuse/core'
import { PreviewEnum } from '@/enums/pageEnum'
import { StorageEnum } from '@/enums/storageEnum'

import { ResultEnum } from '@/enums/httpEnum'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { syncData } from '../../ContentEdit/components/EditTools/hooks/useSyncUpdate.hook'
import { useSync } from '../../hooks/useSync.hook'
import { ProjectInfoEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { changeProjectReleaseApi, getFacilityListApi, ledStrategyApi } from '@/api/path'
import {
  previewPath,
  renderIcon,
  fetchPathByName,
  routerTurnByPath,
  setSessionStorage,
  getLocalStorage,
  httpErrorHandle,
  fetchRouteParamsLocation, getAuth
} from '@/utils'
import { optionsDeviceState, typeOptions } from "@/enums/configForm";
import { icon } from '@/plugins'
import { cloneDeep } from 'lodash'
import { TreeOption, useDialog } from 'naive-ui'

const dialog = useDialog()
const { dataSyncUpdate } = useSync()
const { BrowsersOutlineIcon, SendIcon, AnalyticsIcon, CloseIcon, SearchIcon } = icon.ionicons5
const { SaveIcon } = icon.carbon
const chartEditStore = useChartEditStore()
const canvasConfig = chartEditStore.getEditCanvasConfig
const previewPathRef = ref(previewPath())
const { copy, isSupported } = useClipboard({ source: previewPathRef })

const routerParamsInfo = useRoute()

const modelShow = ref<boolean>(false)
const release = ref<boolean>(false)
const filterTreeData = ref<any>([])
const treeData = ref<any>([])
const expandedKeys = ref([])
const currentNodeKey = ref('')
const selectedOption = ref<string>('online')//状态
const sizeTypeOption = ref<string>('scale')//尺寸
const facilityName = ref<string>('')
const playDurationMode = ref<string>('times')
const times = ref<number>(1)
const minutes = ref<string>('00:00:15')
const checkedKeys = ref<string[]>([])

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
    let param ={
       deviceTypeCode: 'AdvertisingScreen', 
       deviceTypeEnum: 'IOTDEVICE', 
       groupType: 'COMMON', 
       sizeType: sizeTypeOption.value,
       width:canvasConfig.width,
       height:canvasConfig.height
   }
    await getFacilityListApi(param).then((result: any) => {
      const allNode = [{
        id: 'all',
        name: '全部',
        offlineNum: 0,
        onlineNum: 0,
        groupType: "COMMON",
        deviceList: [] // 这里可以包含所有的设备
      }]
      if (result.data && result.data.length) {
        result.data.map((deviceGroup: any) => {
          allNode[0].deviceList = allNode[0].deviceList.concat(deviceGroup)
          allNode[0].offlineNum += deviceGroup.offlineNum
          allNode[0].onlineNum += deviceGroup.onlineNum
        })
      }
      filterTreeData.value = allNode
      treeData.value = allNode
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

const handleNodeClick = (checked: boolean) => {
  console.log('点击树节点data', checked)
}
const renderLabel = ({ option }: { option: any, checked: boolean, selected: boolean }) => {
  return option.groupType === 'COMMON' ? `${option.name}(${option.onlineNum} / ${option.offlineNum + option.onlineNum})` : option.name
}
const renderPrefix = ({ option }: { option: TreeOption }) => {
  return option.groupType === 'COMMON' ? null :
    h('div', { style: { width: '10px', height: '10px', background: option.onlineStatus === 'ONLINE' ? '#3749FF' : '#919299', borderRadius: '10px' } })
}
const updateCheckedKeys = (keys: Array<string>) => {
  checkedKeys.value = keys
  console.log('updateCheckedKeys', keys)
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
  modelShow.value = !modelShow.value;
  console.log('modelShowHandle', treeData.value[0].deviceList);
  if (modelShow.value) {
    // 弹框显示，在线
    if (treeData.value[0].deviceList) {
      const tempTree = treeData.value[0].deviceList;
      let fTreeData = tempTree.filter((deviceGroup: any) => {
        // 在设备组级别过滤
        return deviceGroup.deviceList && deviceGroup.deviceList.some((device: any) => {
          // 在设备级别过滤
          return device.onlineStatus === 'ONLINE';
        });
      }).map((deviceGroup: any) => {
        // 创建一个新的设备组对象，以避免修改原始数据
        return {
          ...deviceGroup,
          // 在设备级别过滤
          deviceList: deviceGroup.deviceList.filter((device: any) => {
            return device.onlineStatus === 'ONLINE';
          })
        };
      });

      let allNode = [{
        id: 'all',
        name: '全部',
        offlineNum: 0,
        onlineNum: 0,
        groupType: "COMMON",
        deviceList: fTreeData // Assuming you want to include the filtered devices
      }];
      filterTreeData.value = allNode;
    }
  }
};


// 切换尺寸
const proSizeChange = (val: string) => {
   sizeTypeOption.value = val;
  getFacilityList();
}
const filterDevices = (val: string) => {
  if (val === 'All') {
    filterTreeData.value = treeData.value
  } else {
    const tempTree = treeData.value[0].deviceList
    let fTreeData = tempTree.filter((deviceGroup: any) => {
      // 在设备组级别过滤
      if (deviceGroup.deviceList) {
        return deviceGroup.deviceList.some((device: any) => {
          // 在设备级别过滤
          return val == 'online'
            ? device.onlineStatus == 'ONLINE'
            : device.onlineStatus == 'OFFLINE'
        })
      }
    })
      .map((deviceGroup: any) => {
        // 创建一个新的设备组对象，以避免修改原始数据
        return {
          ...deviceGroup,
          // 在设备级别过滤
          deviceList: deviceGroup.deviceList.filter((device: any) => {
            return val == 'online'
              ? device.onlineStatus == 'ONLINE'
              : device.onlineStatus == 'OFFLINE'
          })
        }
      })

    let allNode = [{
      id: 'all',
      name: '全部',
      offlineNum: 0,
      onlineNum: 0,
      groupType: "COMMON",
      deviceList: [] // 这里可以包含所有的设备
    }]
    fTreeData.forEach((deviceGroup: any) => {
      allNode[0].deviceList = allNode[0].deviceList.concat(deviceGroup);
      allNode[0].offlineNum += deviceGroup.offlineNum;
      allNode[0].onlineNum += deviceGroup.onlineNum;
    });
    allNode[0].deviceList = fTreeData
    filterTreeData.value = allNode;
  }
}



const savePlayer = () => {
  if (!checkedKeys.value.length) {
    window['$message'].warning('请选择终端！')
    return
  }
  const syncUpdate: any = dataSyncUpdate(false);
  syncUpdate && syncUpdate().then((ledProgramId: string) => {
    if (ledProgramId) {
      const param: any = {
        deviceGroupIdList: checkedKeys.value,
        ledStrategyType: 'REALTIME',
        playDurationCondition: {
          playDurationMode: playDurationMode.value.toUpperCase(),
        },
        ledProgramId
      }
      if (playDurationMode.value === 'times') {
        param.playDurationCondition = {
          playDurationMode: playDurationMode.value.toUpperCase(),
          times: times.value,
        }
      } else {
        param.playDurationCondition = {
          playDurationMode: playDurationMode.value.toUpperCase(),
          minutes: minutes.value
        }
      }
      ledStrategyApi(param).then((result: any) => {
        if (result && result.code === ResultEnum.SUCCESS) {
          modelShow.value = false
        }
        console.log(result)
      })
    }
  });
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
    key: 'template',
    title: () => '存为模板',
    type: () => 'default',
    icon: renderIcon(SaveIcon),
    event: dataSyncUpdate(true)
  },
  {
    key: 'insert',
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
  if (!getAuth('3000101')) {
    cloneList.pop()
  }
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

.deviceTreee {
  //设备树
  margin-left: 70px;
  border-radius: 4px;
  border: 1px solid rgba(55, 73, 255, 0.15);
  margin-top: 10px;
  min-height: 300px;
}

.deviceTitle {
  align-items: center;
}

.deviceListTree {
  @include deep() {
    .n-tree-node-wrapper {
      .n-tree-node-indent+.n-tree-node-indent+.n-tree-node-switcher+.n-tree-node-checkbox {
        display: none;
      }
    }
  }
}
</style>
