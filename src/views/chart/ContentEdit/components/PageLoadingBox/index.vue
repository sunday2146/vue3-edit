<template>
  <div class="page-loading-box" v-if="showLoading">
    <n-spin :size="80" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {icon} from "@/plugins";
import {useChartEditStore} from "@/store/modules/chartEditStore/chartEditStore";

const { ReloadIcon } = icon.ionicons5
const chartEditStore = useChartEditStore()

const showLoading = computed(() => chartEditStore.getShowPageLoading)

</script>
<style lang="scss" scoped>
.page-loading-box {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: #2a2a2b;
  opacity: 0.6;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}
</style>