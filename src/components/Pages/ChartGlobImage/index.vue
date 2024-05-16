<template>
  <img class="list-img" v-if="props.chartConfig.key !== 'TextCommon' || props.chartConfig.category !== 'Tables'" v-lazy="imageInfo" alt="图表图片" />
</template>

<script setup lang="ts">
import { ref, PropType, watch } from 'vue'
import { fetchImages } from '@/packages'
import { ConfigType } from '@/packages/index.d'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<ConfigType>,
    required: true
  }
})

const imageInfo = ref('')

// 获取图片
const fetchImageUrl = async () => {
  console.log('fetchImageUrl', props.chartConfig)
  imageInfo.value = await fetchImages(props.chartConfig)
}

watch(
    () => props.chartConfig.key,
    () => {
      if (props.chartConfig.key !== 'TextCommon' || props.chartConfig.category !== 'Tables' ) {
        fetchImageUrl()
      }
    },
    {
      immediate: true
    }
)
</script>
