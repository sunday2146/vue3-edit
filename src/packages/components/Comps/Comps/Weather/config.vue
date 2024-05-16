<template>
  <CollapseItem name="内容" :expanded="true">
    <SettingItemBox name="城市">
      <n-select
          v-model:value="optionData.fontWeight"
          size="small"
          :options="fontWeightOptions"
      />
    </SettingItemBox>
  </CollapseItem>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import {
  CollapseItem,
  SettingItemBox,
  SettingItem,
} from "@/components/Pages/ChartItemSetting";
import { option, FontWeightEnum, FontWeightObject } from "./config";

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});
const fontWeightOptions = [
  {
    label: FontWeightEnum.CHANGSHA,
    value: FontWeightObject[FontWeightEnum.CHANGSHA],
  },
  {
    label: FontWeightEnum.BEIJIN,
    value: FontWeightObject[FontWeightEnum.BEIJIN],
  },
  {
    label: FontWeightEnum.SHENZHEN,
    value: FontWeightObject[FontWeightEnum.SHENZHEN],
  },
];
</script>
