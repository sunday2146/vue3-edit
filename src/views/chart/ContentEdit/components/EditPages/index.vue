<template>
  <div class="go-flex-items-center">
    <n-popover class="edit-pages-popover" :show-arrow="false" size="small" trigger="click" placement="top-start">
      <template #trigger>
        <n-button class="mr-10" secondary size="small" :disabled="pages.length === 0">
          <span class="btn-text">分页管理</span>
        </n-button>
      </template>

      <div class="pages-list-box">
        <n-scrollbar style="max-height: 500px">
          <div
              class="list-item go-flex-items-center"
              v-for="(item, index) in pages"
              :key="index"
              :title="item"
          >
            <n-text depth="2">{{ item }}</n-text>
            <n-space style="gap: 4px">
              <n-icon class="item-icon" size="16" title="修改页名" :depth="2" @click="editPages(index)">
                <hammer-icon></hammer-icon>
              </n-icon>
              <n-icon class="item-icon" size="16" title="复制页面" :depth="2" @click="addPages(index)">
                <duplicate-outline-icon></duplicate-outline-icon>
              </n-icon>
              <n-icon class="item-icon" size="16" title="移除页面" :depth="2" @click="removePages(index)">
                <trash-icon></trash-icon>
              </n-icon>
            </n-space>
          </div>
        </n-scrollbar>
        <n-button class="mr-10" secondary size="small" @click="addPages">
          <n-icon class="item-icon" size="16" :depth="2">
            <add-icon></add-icon>
          </n-icon>
          <span class="btn-text">新增分页</span>
        </n-button>
        <div class="popover-modal"></div>
      </div>
    </n-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { icon } from '@/plugins'
import { usePagesStore } from '@/store/modules/pagesStore/pagesStore'
import { useDialog, NInput } from 'naive-ui'
import { historyActionTypeName } from '@/store/modules/chartHistoryStore/chartHistoryDefine'

const {
  DesktopOutlineIcon,
  PencilIcon,
  TrashIcon,
  CopyIcon,
  LayersIcon,
  DuplicateIcon,
  DuplicateOutlineIcon,
  HelpOutlineIcon,
  LockClosedOutlineIcon,
  LockOpenOutlineIcon,
  EyeOffOutlineIcon,
  EyeOutlineIcon,
  RemoveIcon,
  HammerIcon,
  AddIcon
} = icon.ionicons5
const { StackedMoveIcon, Carbon3DCursorIcon, Carbon3DSoftwareIcon, PaintBrushIcon } = icon.carbon

const chartPagesStore = usePagesStore()

const pages = chartPagesStore.getPages

const removePages = (index: number) => {
  pages.splice(index, 1)
  chartPagesStore.changePages(pages)
}

const addPages = (index?: number) => {
  pages.push('分页' + (pages.length + 1))
  chartPagesStore.changePages(pages)
}

const editPages = (index: number) => {
  const inputVal = ref(pages[index])
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
      pages[index] = inputVal.value
      chartPagesStore.changePages(pages)
      window['$message'].success('确定')
    },
    onNegativeClick: () => {
      window['$message'].info('已取消')
    }
  })
}
</script>

<style lang="scss" scoped>
.edit-pages-popover {
  .btn-text {
    font-size: 12px;
    margin-right: 3px;
  }
  .pages-list-box {
    width: 140px;
    .list-item {
      z-index: 2;
      position: relative;
      cursor: default;
      padding: 4px 2px;
      justify-content: space-between;
      .item-icon {
        cursor: pointer;
      }
    }
  }
}
</style>
