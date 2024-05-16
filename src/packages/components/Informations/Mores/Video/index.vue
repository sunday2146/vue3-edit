<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 重要：需要设置 crossOrigin="anonymous"，否则保存画板缩略图会失败 -->
  <video
    ref="vVideoRef"
    class="go-video"
    preload="auto"
    crossOrigin="anonymous"
    playsinline
    autoplay
    :loop="option.loop"
    :muted="option.muted"
    :width="w"
    :height="h"
    :src="option.dataset"
  ></video>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch, ref, onMounted, onUnmounted } from 'vue'
import { useChartDataFetch } from '@/hooks'
import { CreateComponentType } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { option as configOption } from './config'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)
let option = shallowReactive({ ...configOption })

// 预览更新
const vVideoRef = ref<any>(null)
const mediaSource = new MediaSource();
let sourceBuffer: any;
// const videoSegments = ['video1.mp4', 'video2.mp4', 'video3.mp4'];
const videoSegments: string[] = []
let segmentIndex = 0; // 当前请求的视频片段索引

// onMounted(() => {
//   if (vVideoRef.value) {
//     vVideoRef.value.src = URL.createObjectURL(mediaSource);
//     mediaSource.addEventListener('sourceopen', sourceOpen);
//   }
// });
//
// onUnmounted(() => {
//   if (mediaSource) {
//     mediaSource.removeEventListener('sourceopen', sourceOpen);
//   }
// });
function sourceOpen() {
  sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'); // 根据视频格式调整codecs
  fetchNextSegment();
}

function fetchNextSegment() {
  if (segmentIndex < videoSegments.length) {
    const segmentUrl = videoSegments[segmentIndex]; // 获取当前片段的URL
    fetch(segmentUrl)
        .then(response => response.arrayBuffer())
        .then(data => {
          sourceBuffer.appendBuffer(data);
          sourceBuffer.addEventListener('updateend', onSegmentAppended, { once: true });
        })
        .catch(error => {
          console.error('Error fetching video segment:', error);
        });
  } else {
    mediaSource.endOfStream(); // 所有片段都已添加
    vVideoRef.value?.play();
  }
}

function onSegmentAppended() {
  segmentIndex++; // 移动到下一个片段
  fetchNextSegment(); // 请求下一个片段
}

useChartDataFetch(props.chartConfig, useChartEditStore, (newData: string) => {
  option.dataset = newData
  const Num = Number(newData[newData.length - 1])
  const strUrl = newData.slice(0, -2)
  for (let i = 1; i <= Num; i++) {
    videoSegments.push(`${strUrl}/${i}`);
  }
})

// 编辑更新
watch(
  () => props.chartConfig.option,
  (newData: any) => {
    option = newData
    if (!vVideoRef.value) return
    const video: any = vVideoRef.value
    video.loop = option.loop
    video.muted = option.muted
    video.play()
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped>
@include go('video') {
  display: block;
  object-fit: v-bind('option.fit');
}
</style>
