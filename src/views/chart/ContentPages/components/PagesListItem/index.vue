<template>
  <div class="go-content-layers-list-item"
       :class="{ hover, select, 'list-mini': selectText }">
    <div class="item-content" :class="[selectText ? 'go-flex-center' : 'space-around']" @click="changePage">

      <n-ellipsis style="margin-right: auto">
        {{props.index + 1}}.
        <span class="list-text">
          {{ props.pageData.title }}
        </span>
        <n-tag size="small" class="famatTime" v-if="!selectText"> {{ famatTime(props.pageData?.editCanvasConfig.timeTotal) }} </n-tag>
      </n-ellipsis>
      <img v-if="!selectText && props.pageData.previewUrl" class="previewUrl" :src="`${requestUrl}/system${props.pageData.previewUrl}`" :key="props.pageData.id" :title="props.pageData.title" />
      <div :class="[selectText ? 'list-icon' : 'list-tools', 'go-transition']">
        <n-icon class="item-icon" size="16" title="修改页名" :depth="2" @click.stop="editPages">
          <hammer-icon></hammer-icon> <span>{{selectText ? '' : '改名'}}</span>
        </n-icon>
        <n-icon class="item-icon" size="16" title="复制页面" :depth="2" @click.stop="copyPage">
          <duplicate-outline-icon></duplicate-outline-icon><span>{{selectText ? '' : '复制'}}</span>
        </n-icon>
        <n-icon class="item-icon" size="16" title="移除页面" :depth="2" @click.stop="removePages">
          <trash-icon></trash-icon><span>{{selectText ? '' : '移除'}}</span>
        </n-icon>
      </div>
<!--      <layers-status :hover="hover" :status="status"></layers-status>-->
    </div>
    <div :class="{ 'select-modal': select }"></div>
  </div>
</template>

<script setup lang="ts">
import {computed, h, PropType, ref} from 'vue'
import {goDialog, requireErrorImg} from '@/utils'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { LayerModeEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d'
import { fetchImages } from '@/packages'
import { icon } from '@/plugins'
import { PageListType } from '@/store/modules/chartEditStore/chartEditStore.d'
// import { LayersStatus } from '../LayersStatus/index'
import {NInput} from "naive-ui";

const requestUrl = import.meta.env.VITE_PRO_PATH
const props = defineProps({
  pageData: {
    type: Object as PropType<PageListType>,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  pageMode: {
    type: String as PropType<LayerModeEnum>,
    default: LayerModeEnum.THUMBNAIL
  }
})

const { TrashIcon, DuplicateOutlineIcon, HammerIcon } = icon.ionicons5

// 全局颜色
const designStore = useDesignStore()
const chartEditStore = useChartEditStore()

// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme
})

const copyPage = () => chartEditStore.copyPageByIndex(props.index)

const famatTime = (time: number = 15) =>  time > 60
    ? `${Math.floor(time / 60)}分${time % 60}秒`
    : `${time}秒`


const removePages = () => {
  const index = props.index
  goDialog({
    message: `确定要删除第${index+1}页【${props.pageData.title}】？`,
    onPositiveCallback: () => {
      try {
        chartEditStore.removePageByIndex(index)
      } catch (D) {
        window.$message.error("删除失败, 请稍后重试!")
      }
    }
  })
}

const changePage = () => {
  setTimeout(()=>{
    chartEditStore.setCurrentPage(props.index)
  }, 0)
}

const editPages = () => {
  let inputVal = ref(props.pageData.title)
  const pageList = chartEditStore.getPageList
  window['$dialog'].create({
    title: '修改页名',
    content: () => h(NInput, {
      value: inputVal.value,
      onInput: e => {
        inputVal.value = e
      }
    }),
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      pageList[props.index].title = inputVal.value
      // chartEditStore.setPageList(pageList.value)
      chartEditStore.setPageConfig('pageList', pageList)
      window['$message'].success('确定')
    },
    onNegativeClick: () => {
      window['$message'].info('已取消')
    }
  })
}

// 计算当前选中目标
const select = computed(() => {
  return chartEditStore.getPageConfig.activeIndex === props.index
})

// 悬浮对象
const hover = computed(() => {
  return props.pageData.id === chartEditStore.getTargetChart.hoverId
})

// 组件状态 隐藏/锁定
// const status = computed(() => {
//   return props.pageData.status
// })

// 是否选中文本
const selectText = computed(() => {
  return props.pageMode === LayerModeEnum.TEXT
})
</script>

<style lang="scss" scoped>
$centerHeight: 128px;
$centerMiniHeight: 28px;
$textSize: 12px;

@include go(content-layers-list-item) {
  position: relative;
  height: $centerHeight;
  width: 90%;
  margin: 5px 5%;
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0);
  @include fetch-bg-color('background-color5');
  @extend .go-transition-quick;
  &.hover,
  &:hover {
    @include fetch-bg-color('background-color4');
    .previewUrl{
      transform: scale(1.06);
    }
    .list-tools{
      opacity: 1;
    }
  }
  &:hover {
    @include deep() {
      .icon-item {
        opacity: 1;
      }
    }
  }
  .previewUrl{
    width: 100%;
    transform: scale(0.96);
    transition: transform 300ms ease-in-out;
  }
  .select-modal,
  .item-content {
    position: absolute;
    top: 0;
    left: 0;
  }
  .item-content {
    z-index: 1;
    padding: 6px 5px;
    justify-content: start !important;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    overflow: hidden;
  }

  .select-modal {
    width: 100%;
    height: 100%;
    opacity: 0.3;
    background-color: v-bind('themeColor');
  }
  .famatTime{
    position: absolute;
    right: 2px;
    top: 2px;
  }

  .list-img {
    flex-shrink: 0;
    height: $centerHeight;
    border-radius: 5px;
    overflow: hidden;
    border: none !important;
    padding: 2px;
    @include hover-border-color('hover-border-color');
  }
  .list-icon {
    display: flex;
    flex-flow: wrap;
    justify-content: flex-start;
    gap: 4px;
  }
  .list-tools{
    position: absolute;
    display: flex;
    bottom: 2px;
    opacity: 0;
    transition: opacity 1s ease-in-out;
    height: 26px;
    width: calc(100% - 8px);
    border-radius: 6px;
    backdrop-filter: blur(20px);
    background-color: rgba(255, 255, 255, 0.15);
    .item-icon{
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      flex: 1;
      &:hover {
        background-color: rgba(232, 128, 128, 0.7);
      }
      span {
        font-size: 12px;
        font-style: normal;
      }
    }
  }

  .edit-btn {
    gap: 4px
  }

  .list-text {
    padding-left: 6px;
    font-size: $textSize;
  }

  /* 选中样式 */
  &.select {
    border: 1px solid v-bind('themeColor');
    background-color: rgba(0, 0, 0, 0);
  }

  // mini样式
  &.list-mini {
    height: $centerMiniHeight;
  }
}
</style>
