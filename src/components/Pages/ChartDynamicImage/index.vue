<template>
  <img class="list-img" :src="props.chartConfig.image" :key="props.chartConfig.title" :title="props.chartConfig.title" alt="图表图片" />
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ConfigType } from '@/packages/index.d'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<ConfigType>,
    required: true
  }
})
</script>
