<template>
  <div class="go-icon-box">
    <GoIconify :icon="((dataset || 'wi:day-sunny-overcast') as string)" color="#03A9F4" :size="64" :width="64" :rotate="rotate" />
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { GoIconify } from '@/components/GoIconify'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)
const { dataset, color, size, rotate } = toRefs(props.chartConfig.option)
</script>

<style lang="scss" scoped>
@include go('icon-box') {
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind('`${w}px`');
  height: v-bind('`${h}px`');
}
</style>
