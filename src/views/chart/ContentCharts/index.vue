<template>
  <!-- 左侧所有组件的展示列表 -->
  <content-box class="go-content-charts" :class="{ scoped: !getCharts }" title="" :depth="1" :backIcon="false">
    <template #icon>
      <n-image
          width="32"
          src="/system/mediaInfo/preview/1166808443746693120"
      />
    </template>
    <template #top-right>
      <image-search v-if="selectValue === 'Images' || selectValue === 'Videos' || selectValue === 'Tables'" v-show="getCharts" :menuOptions="menuOptions" :menuKey="selectValue"></image-search>
      <charts-search v-else v-show="getCharts" :menuOptions="menuOptions"></charts-search>
    </template>
    <!-- 图表 -->
    <aside>
      <div class="menu-width-box">
<!--        433333-->
        <n-menu
          class="menu-width"
          v-model:value="selectValue"
          :options="menuOptions"
          :icon-size="16"
          :indent="18"
          @update:value="clickItemHandle"
        ></n-menu>
        <div class="menu-component-box">
          <go-skeleton :load="!selectOptions" round text :repeat="2" style="width: 90%"></go-skeleton>
          <charts-option-content
            v-if="selectOptions"
            :selectOptions="selectOptions"
            :key="selectValue"
          ></charts-option-content>
          <div v-if="selectValue === 'Images' || selectValue === 'Videos' || selectValue === 'Tables'" class="source-pagination">
            <n-pagination v-model:page="payload.pageNum" :page-count="payload.totalPages" @update:page="changePage" simple />
          </div>
        </div>
      </div>
    </aside>
  </content-box>
</template>

<script setup lang="ts">
import {onMounted, unref, ref, computed, watch} from 'vue'
import { ContentBox } from '../ContentBox/index'
import { ChartsOptionContent } from './components/ChartsOptionContent'
import { ChartsSearch } from './components/ChartsSearch'
import { ImageSearch } from './components/ImageSearch'
import { useAsideHook } from './hooks/useAside.hook'
import { PackagesCategoryEnum, ImagePayloadType } from '@/packages/index.d'
import {usePackagesStore} from "@/store/modules/packagesStore/packagesStore";

const { getCharts, BarChartIcon, themeColor, selectOptions, selectValue, clickItemHandle, menuOptions, getImageListReq, getVideoListReq, getTxtListReq } = useAsideHook()
onMounted(async () => {
  await getImageListReq(PackagesCategoryEnum.IMAGES, 1)
  await getVideoListReq(PackagesCategoryEnum.VIDEOS, 1)
  await getTxtListReq(1)
})
const packagesStore = usePackagesStore()
const pageNum = ref(1)
const imagesPayload = computed(() => packagesStore.getImagePayload)
const videosPayload = computed(() => packagesStore.getVideoPayload)
// const packagesList = computed(() => packagesStore.getPackagesList)

const payload = computed(() => {
  return selectValue.value === 'Images' ? packagesStore.getImagePayload :
      selectValue.value === 'Videos' ? packagesStore.getVideoPayload :
        packagesStore.getTxtPayload
})
const changePage = async (pageNum: number) => {
  if (selectValue.value === 'Images') {
    packagesStore.setImagePayload('pageNum', pageNum)
    await getImageListReq(PackagesCategoryEnum.IMAGES, pageNum, true)
  } else if (selectValue.value === 'Videos'){
    packagesStore.setVideoPayload('pageNum', pageNum)
    await getVideoListReq(PackagesCategoryEnum.VIDEOS, pageNum, true)
  } else {
    packagesStore.setTxtPayload('pageNum', pageNum)
    await getTxtListReq(pageNum)
  }
}

const selectOptionsRef = ref(selectOptions)
pageNum.value= packagesStore.getImagePayload.pageNum

// watch(() => selectOptions.value && selectOptions.value.list, (newValue) => {
//   console.log(newValue, 99998)
// })
</script>

<style lang="scss" scoped>
/* 整体宽度 */
$width: 330px;
/* 列表的宽度 */
$widthScoped: 65px;
/* 此高度与 ContentBox 组件关联 */
$topHeight: 40px;

@include go(content-charts) {
  width: $width;
  @extend .go-transition;
  &.scoped,
  .menu-width {
    width: $widthScoped;
  }
  .menu-width-box {
    display: flex;
    height: calc(100vh - #{$--header-height} - #{$topHeight});
    .menu-width {
      flex-shrink: 0;
      @include fetch-bg-color('background-color2');
    }
    .menu-component-box {
      flex-shrink: 0;
      width: $width - $widthScoped;
      overflow: hidden;
      .source-pagination{
        width: 100%;
        margin-top: -33px;
        justify-content: center;
        display: flex;
        @include fetch-bg-color('background-color4');
      }
    }
  }
  @include deep() {
    .menu-width {
      .n-menu-item {
        height: auto !important;
        &.n-menu-item--selected {
          &::after {
            content: '';
            position: absolute;
            left: 2px;
            top: 0;
            height: 100%;
            width: 3px;
            background-color: v-bind('themeColor');
            border-top-right-radius: 3px;
            border-bottom-right-radius: 3px;
          }
        }
        .n-menu-item-content {
          display: flex;
          flex-direction: column;
          padding: 6px 12px !important;
          font-size: 14px !important;
        }
        .n-menu-item-content__icon {
          font-size: 18px !important;
          margin-right: 0 !important;
        }
      }
    }
  }
}
</style>
