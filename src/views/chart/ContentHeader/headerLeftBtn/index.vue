<template>
  <n-space class="header-left-btn" :size="25">
    <!--    <n-button size="small">-->
    <!--      分页-->
    <!--    </n-button>-->
    <n-space>
      <!-- 模块展示按钮 -->
      <n-tooltip v-for="item in btnList" :key="item.key" placement="bottom" trigger="hover">
        <template #trigger>
          <n-button size="small" ghost :type="styleHandle(item)" :focusable="false" @click="clickHandle(item)">
            <component :is="item.icon"></component>
          </n-button>
        </template>
        <span>{{ item.title }}</span>
      </n-tooltip>

      <n-divider vertical />

      <!-- 历史记录按钮 -->
      <n-tooltip v-for="item in historyList" :key="item.key" placement="bottom" trigger="hover">
        <template #trigger>
          <n-button size="small" ghost type="primary" :disabled="!item.select" @click="clickHistoryHandle(item)">
            <component :is="item.icon"></component>
          </n-button>
        </template>
        <span>{{ item.title }}</span>
      </n-tooltip>

      <!-- 保存 -->
      <!--      <n-tooltip placement="bottom" trigger="hover">-->
      <!--        <template #trigger>-->
      <!--          <div class="save-btn" >-->
      <!--            <n-button size="small" type="primary" ghost @click="dataSyncUpdate()">-->
      <!--              <template #icon>-->
      <!--                <n-icon>-->
      <!--                  <SaveIcon></SaveIcon>-->
      <!--                </n-icon>-->
      <!--              </template>-->
      <!--            </n-button>-->
      <!--          </div>-->
      <!--        </template>-->
      <!--        <span>保存11</span>-->
      <!--      </n-tooltip>-->
      <n-form inline :label-width="40" size="small" label-placement="left" style="width: 240px;height: 40px">
        <n-form-item label="宽度">
          <!-- 尺寸选择 -->
          <n-input-number size="small" v-model:value="canvasConfig.width" :disabled="editCanvas.lockScale"
            :validator="validator" :show-button="false" @update:value="changeSizeHandle"></n-input-number>
        </n-form-item>
        <n-form-item label="高度">
          <n-input-number size="small" v-model:value="canvasConfig.height" :disabled="editCanvas.lockScale"
            :validator="validator" :show-button="false" @update:value="changeSizeHandle"></n-input-number>
        </n-form-item>
      </n-form>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { toRefs, ref, Ref, reactive, computed, nextTick } from 'vue'
import { renderIcon, goDialog, goHome, fetchRouteParamsLocation, httpErrorHandle } from '@/utils'
import { icon } from '@/plugins'
import { useRemoveKeyboard } from '../../hooks/useKeyboard.hook'
import { useSync } from '../../hooks/useSync.hook'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useChartHistoryStore } from '@/store/modules/chartHistoryStore/chartHistoryStore'
import { HistoryStackEnum } from '@/store/modules/chartHistoryStore/chartHistoryStore.d'
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore'
import { ChartLayoutStoreEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d'
import { EditCanvasConfigEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { updateProjectApi } from "@/api/path";
import { ResultEnum } from "@/enums/httpEnum";

const chartLayoutStore = useChartLayoutStore()

const { LayersIcon, BarChartIcon, PrismIcon, HomeIcon, ArrowBackIcon, ArrowForwardIcon, BrowsersOutlineIcon } = icon.ionicons5
const { SaveIcon } = icon.carbon
const { setItem } = useChartLayoutStore()
const { dataSyncUpdate } = useSync()
const { getLayers, getCharts, getDetails, getPages } = toRefs(useChartLayoutStore())
const chartEditStore = useChartEditStore()
const chartHistoryStore = useChartHistoryStore()
const canvasConfig = computed(() => chartEditStore.getEditCanvasConfig)
const editCanvas = chartEditStore.getEditCanvas

const inputTimeTotalRef = ref(null)
const timeTotal = ref(chartEditStore.getEditCanvasConfig.timeTotal)

interface ItemType<T> {
  key: T
  select: Ref<boolean> | boolean
  title: string
  icon: any
}

const validator = (x: number) => x > 300
const changeSizeHandle = () => {
  // chartEditStore.computedScale()
  chartLayoutStore.setItemUnHandle(ChartLayoutStoreEnum.RE_POSITION_CANVAS, true)
  chartEditStore.computedScale()
}

const btnList = reactive<ItemType<ChartLayoutStoreEnum>[]>([
  {
    key: ChartLayoutStoreEnum.CHARTS,
    select: getCharts,
    title: '图表组件',
    icon: renderIcon(BarChartIcon)
  },
  {
    key: ChartLayoutStoreEnum.PAGES,
    select: getPages,
    title: '分页管理',
    icon: renderIcon(BrowsersOutlineIcon)
  },
  {
    key: ChartLayoutStoreEnum.LAYERS,
    select: getLayers,
    title: '图层控制',
    icon: renderIcon(LayersIcon)
  },
  {
    key: ChartLayoutStoreEnum.DETAILS,
    select: getDetails,
    title: '详情设置',
    icon: renderIcon(PrismIcon)
  }
])

const handleFocusTimeTotal = () => {
  nextTick(() => {
    inputTimeTotalRef.value && (inputTimeTotalRef.value as any).focus()
  })
}
// const handleBlurTimeTotal = async () => {
//   chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.TIME_TOTAL, timeTotal.value || '')
// }
const isBackStack = computed(() => chartHistoryStore.getBackStack.length > 1)

const isForwardStack = computed(() => chartHistoryStore.getForwardStack.length > 0)

const historyList = reactive<ItemType<HistoryStackEnum>[]>([
  {
    key: HistoryStackEnum.BACK_STACK,
    // 一定会有初始化画布
    select: isBackStack,
    title: '后退',
    icon: renderIcon(ArrowBackIcon)
  },
  {
    key: HistoryStackEnum.FORWARD_STACK,
    select: isForwardStack,
    title: '前进',
    icon: renderIcon(ArrowForwardIcon)
  }
])


// store 描述的是展示的值，所以和 ContentConfigurations 的 collapsed 是相反的
const styleHandle = (item: ItemType<ChartLayoutStoreEnum>) => {
  if (item.key === ChartLayoutStoreEnum.DETAILS) {
    return item.select ? '' : 'primary'
  }
  return item.select ? 'primary' : ''
}

// 布局处理
const clickHandle = (item: ItemType<ChartLayoutStoreEnum>) => {
  setItem(item.key, !item.select)
}

// 历史记录处理
const clickHistoryHandle = (item: ItemType<HistoryStackEnum>) => {
  switch (item.key) {
    case HistoryStackEnum.BACK_STACK:
      chartEditStore.setBack()
      break;
    case HistoryStackEnum.FORWARD_STACK:
      chartEditStore.setForward()
      break;
  }
}

// 返回首页
const goHomeHandle = () => {
  goDialog({
    message: '确定已保存了数据（Ctrl / ⌘ + S），并返回到首页吗？',
    isMaskClosable: true,
    onPositiveCallback: () => {
      goHome()
      useRemoveKeyboard()
    }
  })
}
</script>
<style lang="scss" scoped>
.header-left-btn {
  margin-left: -37px;
}
</style>
