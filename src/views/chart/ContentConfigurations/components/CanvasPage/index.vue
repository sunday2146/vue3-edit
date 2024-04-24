<template>
  <div class="go-canvas-setting">
    <n-form inline :label-width="45" size="small" label-placement="left">
      <n-form-item label="宽度">
        <!-- 尺寸选择 -->
        <n-input-number size="small" v-model:value="canvasConfig.width" disabled :validator="validator"
          @update:value="changeSizeHandle"></n-input-number>
      </n-form-item>
      <n-form-item label="高度">
        <n-input-number size="small" v-model:value="canvasConfig.height" disabled :validator="validator"
          @update:value="changeSizeHandle"></n-input-number>
      </n-form-item>
    </n-form>
    <n-space style="margin-bottom: 20px">
      <n-text>播放时长</n-text>
      <n-input-number size="small" v-model:value="canvasConfig.timeTotal" maxlength="9" min="1"
        @update:value="changeTimeHandle">
        <template #suffix>
          秒
        </template>
      </n-input-number>
    </n-space>

    <div class="upload-box">
      <img class="upload-show" v-if="canvasConfig.backgroundImage" :src="canvasConfig.backgroundImage" alt="背景"
        @click="openbgModal" />
      <n-button v-show="!canvasConfig.backgroundImage" class="upload-show" style="width: 100%"
        @click="openbgModal">选择背景图</n-button>
    </div>
    <n-space vertical :size="12">
      <n-space>
        <n-text>背景颜色</n-text>
        <div class="picker-height">
          <n-color-picker v-if="!switchSelectColorLoading" size="small" style="width: 250px"
            v-model:value="canvasConfig.background" :showPreview="true" :swatches="swatchesColors"></n-color-picker>
        </div>
      </n-space>
      <n-space>
        <n-text>应用类型</n-text>
        <n-select size="small" style="width: 250px" v-model:value="selectColorValue"
          :disabled="!canvasConfig.backgroundImage" :options="selectColorOptions"
          @update:value="selectColorValueHandle" />
      </n-space>
      <n-space>
        <n-text>背景控制</n-text>
        <n-button class="clear-btn" size="small" :disabled="!canvasConfig.backgroundImage" @click="clearImage">
          清除背景
        </n-button>
        <n-button class="clear-btn" size="small" :disabled="!canvasConfig.background" @click="clearColor">
          清除颜色
        </n-button>
      </n-space>
      <n-space>
        <n-text>适配方式</n-text>
        <n-button-group>
          <n-button v-for="item in previewTypeList" :key="item.key"
            :type="canvasConfig.previewScaleType === item.key ? 'primary' : 'tertiary'" ghost size="small"
            @click="selectPreviewType(item.key)">
            <n-tooltip :show-arrow="false" trigger="hover">
              <template #trigger>
                <n-icon class="select-preview-icon" size="18">
                  <component :is="item.icon"></component>
                </n-icon>
              </template>
              {{ item.desc }}
            </n-tooltip>
          </n-button>
        </n-button-group>
      </n-space>
    </n-space>
          
    <!-- 选择背景图弹框 -->
    <n-modal v-model:show="showModal" class="selectBg-modal" :style="{ width: '1500px' }" preset="dialog" title="添加素材"
      content="你确认?" positive-text="确定" negative-text="取消" @positive-click="submitCallback"
      @negative-click="cancelCallback">

      <div class="bg_modal">
        <div class="left_tree">
          <n-input v-model:value="pattern" placeholder="搜索" size="small" />

          <n-tree :data="treeData" :pattern="pattern" :show-irrelevant-nodes="showIrrelevantNodes" :props="defaultProps"
            :checkable="false" label-field="name" key-field="id" :default-expanded-keys="defaultExpandedKeys"
            :node-props="nodeProps">
          </n-tree>
          <!-- <n-tree block-line :data="treeData" :default-expanded-keys="defaultExpandedKeys"  /> -->

        </div>

        <div class="right-table media-table">
          <div class="imageSearch">
            <div class="searchFilter">
              <div class="searchInputs">
                <n-form :model="filter" label-placement="left" label-width="auto" inline>
                  <n-form-item>
                    <n-input v-model:value="filter.fileName" size="small" clearable placeholder="请输入素材名称">
                      <template #suffix>
                        <i class="el-icon-search"></i>
                      </template>
                    </n-input>
                  </n-form-item>
                  <n-form-item label="素材类型">
                    <n-select v-model:value="filter.type" style="width: 150px;" size="small" :options="materialTypes" clearable>
                      <!-- <el-option v-for="item in materialTypes" :key="item.id" :label="item.name"
                        :value="item.id"></el-option> -->
                    </n-select>
                  </n-form-item>
                </n-form>
              </div>
              <div class="searchControl">
                <n-button type="primary" size="small" @click="getData">查询</n-button>
                <n-button size="small" @click="clear">重置</n-button>
              </div>
            </div>
          </div>
          <n-data-table class="media-table" :columns="columns" :data="tableData" :pagination="pagination" :remote="true">
          </n-data-table>
        </div>

      </div>


    </n-modal>


    <!-- 滤镜 -->
    <styles-setting :isCanvas="true" :chartStyles="canvasConfig"></styles-setting>
    <n-divider style="margin: 10px 0"></n-divider>

    <!-- 主题选择和全局配置 -->
    <n-tabs class="tabs-box" size="small" type="segment">
      <n-tab-pane v-for="item in globalTabList" :key="item.key" :name="item.key" size="small"
        display-directive="show:lazy">
        <template #tab>
          <n-space>
            <span>{{ item.title }}</span>
            <n-icon size="16" class="icon-position">
              <component :is="item.icon"></component>
            </n-icon>
          </n-space>
        </template>
        <component :is="item.render"></component>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, computed, onMounted, reactive, h } from 'vue'
import { backgroundImageSize } from '@/settings/designSetting'
import { swatchesColors } from '@/settings/chartThemes/index'
import { FileTypeEnum } from '@/enums/fileTypeEnum'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { EditCanvasConfigEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { useSystemStore } from '@/store/modules/systemStore/systemStore'
import { StylesSetting } from '@/components/Pages/ChartItemSetting'
import { UploadCustomRequestOptions, NTree } from 'naive-ui'
import { loadAsyncComponent, fetchRouteParamsLocation } from '@/utils'
import { PreviewScaleEnum } from '@/enums/styleEnum'
import { ResultEnum } from '@/enums/httpEnum'
import { icon } from '@/plugins'
import { uploadFile } from '@/api/path'
import { useSync } from "@/views/chart/hooks/useSync.hook"
import { TreeOption, useDialog, useMessage, NButton, FormInst } from 'naive-ui'
import { getTreeApi, getMediaInfo } from '@/api/path'
const { ColorPaletteIcon } = icon.ionicons5
const { ScaleIcon, FitToScreenIcon, FitToHeightIcon, FitToWidthIcon } = icon.carbon

const { dataSyncUpdate } = useSync()
const chartEditStore = useChartEditStore()
const systemStore = useSystemStore()
// const canvasConfig = chartEditStore.getEditCanvasConfig
const canvasConfig = computed(() => chartEditStore.getEditCanvasConfig)
const editCanvas = chartEditStore.getEditCanvas

const uploadFileListRef = ref()
const switchSelectColorLoading = ref(false)
const selectColorValue = ref(0)
const ChartThemeColor = loadAsyncComponent(() => import('./components/ChartThemeColor/index.vue'))

// 选择背景图弹框
const message = useMessage()
const showModal = ref(false)

const filterTreeData = ref<any>([])
const checkedKeys = ref<string[]>([])
const treeData = ref<any>([])
const deviceType = ref<string>('led')
const expandedKeys = ref<any>([])
const tableData = ref([])
const directoryId = ref<string>('0')
const pattern = ref('')
const showIrrelevantNodes = ref(false)

const selectMediaObj = ref<object>({})
const defaultProps = {
  children: 'children',
  label: 'name'
};
const defaultExpandedKeys = treeData.value?.length ? treeData.value.map((node: any) => node.id) : [];
// 定义素材类型数据
const materialTypes = [
  { label: '图片', value: 'IMG' },
  { label: '视频', value: 'VIDEO' }
];
const filter = ref({
  examineState: '',
  fileName: '',
  type: 'IMG',
  name: '',
  sortOrder: '',
  sortName: '',
  pageNum: 1, // 当前页码
  pageSize: 10, // 每页显示条数
  rowTotal: 0 // 总条数
})
const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [5, 10, 20, 50],
  onChange: (page: number) => {
    pagination.page = page
    filter.value.pageNum = page
    getData()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    filter.value.pageSize = pageSize
    getData()
  }
})


// 重置筛选条件的方法
const clear = () => {
  filter.value.fileName = '';
  filter.value.type = '';
  // 重置后重新获取数据
  getData();
};


const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      const rawOption = option;
      directoryId.value = rawOption.id as string;
      // filter.pageNum=1;
      console.log('nodeProps-Checked keys:', rawOption.id);
      getData()
    }
  }
}




const openbgModal = async () => {
  showModal.value = true
  // pagination.page= 1
  filter.value.pageNum = 1
  await getTrees('')
  await getData()
}

// 获取左侧树数据
const getTrees = async (id: string) => {
  const res: any = await getTreeApi({
    appType: deviceType.value
  })
  console.log('getTrees1=', res);
  treeData.value = [res.data] // Assuming res.data contains the tree data

  console.log('getTrees=', id, treeData.value[0].id);
}




// 获得表格数据
const getTableData = async (data: string) => {
  // currNodeData.value = data
  // this.tableData = []
  // this.getSubChildren(data);
  filter.value.rowTotal = tableData.value.length
}


/**
     * 获取部门树
     * 获取表格数据
     */
const getData = async () => {
  try {
    // 直接使用 filter.value 来访问 pageNum 和 pageSize
    let params = {
      condition: {
        directoryId: directoryId.value,
        examineState: 1,
        type: filter.value.type,
        fileName: filter.value.fileName,
        appType: deviceType.value
      },
      sortOrder: filter.value.sortOrder,
      sortName: filter.value.sortName,
      pageNum: filter.value.pageNum,
      pageSize: filter.value.pageSize
    };

    const requestData: any = await getMediaInfo(params);
    tableData.value = requestData.data.data;
    filter.value.pageSize = requestData.data.pageSize;
    pagination.pageCount = requestData.data.totalPages;
    console.log('Updated tableData:', tableData.value);
    // ... 其他代码
  } catch (error) {
    // ... 错误处理
  }
}

const backgroundImage = ref<string>('');
const sendMedia = (row: any) => {
  // selectMediaObj = toRaw(row)
  backgroundImage.value = '/system' + row.coverImagePreviewUrl
  //设置在页面背景图

}
const cancelCallback = () => {
  message.success('Cancel')
}
const submitCallback = () => {
  chartEditStore.setEditCanvasConfig(
    EditCanvasConfigEnum.BACKGROUND_IMAGE,
    backgroundImage.value
  )
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, false)
  message.success('Submit')
}



const createColumns = () => {
  return [
    {
      title: '素材名称',
      key: 'name'
    },
    {
      title: '类型',
      key: 'typeDetail'
    },
    {
      title: '缩略图',
      key: 'address',
      render(row: any) {
        if (['VIDEO', 'video', 'IMG', 'image'].includes(row.type)) {
          if (!row.coverImagePreviewUrl) {
            return h('div', '暂无');
          } else {
            return h('div', { class: 'Media-images' }, [
              h('img', {
                src: `/system${row.coverImagePreviewUrl}`,
                style: { objectFit: 'contain' }
              })
            ]);
          }
        }
      }
    },
    {
      title: '大小',
      key: 'size',
      render(row: any) {
        if (typeof row.size !== 'number') {
          return '未知大小'; // 如果 row.size 不是数字，则显示未知大小
        }
        let temp = (row.size / 1024 / 1024).toFixed(2); // 转换为MB并保留两位小数
        if (parseFloat(temp) === 0) {
          return '< 0.01 MB'; // 如果小于0.01MB，则显示 < 0.01 MB
        }
        return `${temp} MB`; // 否则显示转换后的大小
      }
    },
    {
      title: '上传用户',
      key: 'createUserName'
    },
    {
      title: '上传时间',
      key: 'createTime'
    },
    {
      title: '操作',
      key: 'actions',
      render(row: any) {
        return h(
          NButton,
          {
            size: 'small',
            onClick: () => sendMedia(row)
          },
          { default: () => '选中' }
        )
      }
    }
  ]
}



const data = ref([])
const columns = createColumns();
//背景图end

// 默认应用类型
const selectColorOptions = [
  {
    label: '应用颜色',
    value: 0
  },
  {
    label: '应用背景',
    value: 1
  }
]

const globalTabList = [
  {
    key: 'ChartTheme',
    title: '主题颜色',
    icon: ColorPaletteIcon,
    render: ChartThemeColor
  }
]

const previewTypeList = [
  {
    key: PreviewScaleEnum.FIT,
    title: '自适应',
    icon: ScaleIcon,
    desc: '自适应比例展示，页面会有留白'
  },
  {
    key: PreviewScaleEnum.SCROLL_Y,
    title: 'Y轴滚动',
    icon: FitToWidthIcon,
    desc: 'X轴铺满，Y轴自适应滚动'
  },
  {
    key: PreviewScaleEnum.SCROLL_X,
    title: 'X轴滚动',
    icon: FitToHeightIcon,
    desc: 'Y轴铺满，X轴自适应滚动'
  },
  {
    key: PreviewScaleEnum.FULL,
    title: '铺满',
    icon: FitToScreenIcon,
    desc: '强行拉伸画面，填充所有视图'
  }
]

watch(
  () => canvasConfig.value.selectColor,
  newValue => {
    selectColorValue.value = newValue ? 0 : 1
  },
  {
    immediate: true
  }
)

// 画布尺寸规则
const validator = (x: number) => x > 50

// 修改尺寸
const changeSizeHandle = () => {
  chartEditStore.computedScale()
}

const changeTimeHandle = (time: number) => {
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.TIME_TOTAL, time)
}

// 上传图片前置处理
//@ts-ignore
const beforeUploadHandle = async ({ file }) => {
  uploadFileListRef.value = []
  const type = file.file.type
  const size = file.file.size

  if (size > 1024 * 1024 * backgroundImageSize) {
    window['$message'].warning(`图片超出 ${backgroundImageSize}M 限制，请重新上传！`)
    return false
  }
  if (type !== FileTypeEnum.PNG && type !== FileTypeEnum.JPEG && type !== FileTypeEnum.GIF) {
    window['$message'].warning('文件格式不符合，请重新上传！')
    return false
  }
  return true
}

// 应用颜色
const selectColorValueHandle = (value: number) => {
  canvasConfig.value.selectColor = value == 0
}

// 清除背景
const clearImage = () => {
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.BACKGROUND_IMAGE, undefined)
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, true)
}

// 启用/关闭 颜色（强制更新）
const switchSelectColorHandle = () => {
  switchSelectColorLoading.value = true
  setTimeout(() => {
    switchSelectColorLoading.value = false
  })
}

// 清除颜色
const clearColor = () => {
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.BACKGROUND, undefined)
  if (canvasConfig.value.backgroundImage) {
    chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, false)
  }
  switchSelectColorHandle()
}

// 自定义上传操作
const customRequest = (options: UploadCustomRequestOptions) => {
  const { file } = options
  nextTick(async () => {
    if (file.file) {
      // 修改名称
      const newNameFile = new File([file.file], `${fetchRouteParamsLocation()}_index_background.png`, {
        type: file.file.type
      })
      let uploadParams = new FormData()
      uploadParams.append('file', newNameFile)
      const uploadRes = await uploadFile(uploadParams)

      if (uploadRes && uploadRes.code === ResultEnum.SUCCESS) {
        if (uploadRes.data.downloadUrl) {
          chartEditStore.setEditCanvasConfig(
            EditCanvasConfigEnum.BACKGROUND_IMAGE,
            `/system${uploadRes.data.downloadUrl}?time=${new Date().getTime()}`
          )
        } else {
          chartEditStore.setEditCanvasConfig(
            EditCanvasConfigEnum.BACKGROUND_IMAGE,
            `${systemStore.getFetchInfo.OSSUrl || ''}${uploadRes.data.name}?time=${new Date().getTime()}`
          )
        }
        chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, false)
        return
      }
      window['$message'].error('添加图片失败，请稍后重试！')
    } else {
      window['$message'].error('添加图片失败，请稍后重试！')
    }
  })
}

// 选择适配方式
const selectPreviewType = (key: PreviewScaleEnum) => {
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.PREVIEW_SCALE_TYPE, key)
}
</script>

<style lang="scss" scoped>
$uploadWidth: 326px;
$uploadHeight: 193px;




.bg_modal {
  display: flex;

  .left_tree {
    width: 300px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 10px;
    margin-right: 20px;
    float: left;
    overflow: auto;
  }

  .right-table {
    float: left;
    width: calc(100% - 330px);
  }
}


@include go(canvas-setting) {
  padding-top: 20px;



  .upload-box {
    cursor: pointer;
    margin-bottom: 20px;

    @include deep() {
      .n-upload-dragger {
        padding: 5px;
        width: $uploadWidth;
        background-color: rgba(0, 0, 0, 0);
      }
    }

    .upload-show {
      width: -webkit-fill-available;
      height: $uploadHeight;
      border-radius: 5px;
    }

    .upload-img {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        height: 150px;
      }

      .upload-desc {
        padding: 10px 0;
      }
    }
  }

  .icon-position {
    padding-top: 2px;
  }

  .picker-height {
    min-height: 35px;
  }

  .clear-btn {
    padding-left: 2.25em;
    padding-right: 2.25em;
  }

  .select-preview-icon {
    padding-right: 0.68em;
    padding-left: 0.68em;
  }

  .tabs-box {
    margin-top: 20px;
  }
}
</style>
