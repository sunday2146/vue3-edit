import { ref, watch, computed } from 'vue'
import { icon } from '@/plugins'
import {renderLang, renderIcon, httpErrorHandle} from '@/utils'
import { themeColor, setItem, getCharts } from './useLayout.hook'
import { PackagesCategoryEnum, PackagesCategoryName, ConfigType, ChartFrameEnum, PackagesType } from '@/packages/index.d'
import { usePackagesStore } from '@/store/modules/packagesStore/packagesStore'
import { ChartLayoutStoreEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d'
import {getMediaInfo, getTreeApi} from "@/api/path";
import {ResultEnum} from "@/enums/httpEnum";
import {ImageConfig} from "@/packages/components/Informations/Mores/Image/index";
import {VideoConfig} from "@/packages/components/Informations/Mores/Video/index";
import {TextCommonConfig} from "@/packages/components/Informations/Texts/TextCommon/index";
import {ChatCategoryEnum, ChatCategoryEnumName} from "@/packages/components/Images/index.d";
// 图标
const { AirPlaneOutlineIcon, ImageIcon, BarChartIcon } = icon.ionicons5
const { TableSplitIcon, RoadmapIcon, SpellCheckIcon, GraphicalDataFlowIcon } = icon.carbon

const requestUrl = import.meta.env.VITE_PRO_PATH
// 图表
export type MenuOptionsType = {
  key: string
  icon: ReturnType<typeof renderIcon>
  label: ReturnType<typeof renderLang>
  list: ConfigType[]
}

const packagesListObj = {
  [PackagesCategoryEnum.CHARTS]: {
    icon: renderIcon(RoadmapIcon),
    label: PackagesCategoryName.CHARTS
  },
  [PackagesCategoryEnum.INFORMATIONS]: {
    icon: renderIcon(SpellCheckIcon),
    label: PackagesCategoryName.INFORMATIONS
  },
  [PackagesCategoryEnum.TABLES]: {
    icon: renderIcon(TableSplitIcon),
    label: PackagesCategoryName.TABLES
  },
  [PackagesCategoryEnum.DECORATES]: {
    icon: renderIcon(GraphicalDataFlowIcon),
    label: PackagesCategoryName.DECORATES
  },
  [PackagesCategoryEnum.PHOTOS]: {
    icon: renderIcon(ImageIcon),
    label: PackagesCategoryName.PHOTOS
  },
  [PackagesCategoryEnum.ICONS]: {
    icon: renderIcon(AirPlaneOutlineIcon),
    label: PackagesCategoryName.ICONS
  },
  [PackagesCategoryEnum.IMAGES]: {
    icon: renderIcon(AirPlaneOutlineIcon),
    label: PackagesCategoryName.IMAGES
  },
  [PackagesCategoryEnum.VIDEOS]: {
    icon: renderIcon(AirPlaneOutlineIcon),
    label: PackagesCategoryName.VIDEOS
  }
}

export const getPlainText = (htmlContent: string) => {
  // 创建一个新的DOM解析器
  var parser = new DOMParser();
  // 使用解析器解析HTML内容，并获取文档对象
  var doc = parser.parseFromString(htmlContent, 'text/html');
  // 创建一个文本节点的范围
  var range = doc.createRange();
  // 选择文档中的所有节点
  range.selectNodeContents(doc.body);
  // 使用范围提取文本内容
  return range.toString();
}

export const useAsideHook = () => {
  const packagesStore = usePackagesStore()
  const menuOptions: MenuOptionsType[] = []
// 处理列表
  const handlePackagesList = () => {
    for (const val in packagesStore.getPackagesList) {
      menuOptions.push({
        key: val,
        // @ts-ignore
        icon: packagesListObj[val].icon,
        // @ts-ignore
        label: packagesListObj[val].label,
        // @ts-ignore
        list: packagesStore.getPackagesList[val]
      })
    }
  }
  // await getImageListReq()
  handlePackagesList()

  // 选中的对象值
  const selectOptions = ref(menuOptions[0])

  const getImageListReq = async <T extends keyof PackagesType>(type: T, pageNum: number=1, isUp: boolean = false) => {
    const imageList: Array<ConfigType> = []
    const payload = packagesStore.getImagePayload
    const param = {
      condition: {
        appType: "led",
        directoryIds: payload.directoryIds,
        examineState: 1,
        type: "IMG",
        fileName: payload.fileName || ''
      },
      pageNum: payload.pageNum || 1,
      pageSize: 10
    }
    const res = await getMediaInfo(param)
    if (res && res.code === ResultEnum.SUCCESS) {
      res.data.data.map((i: any) => {
        imageList.push({
          ...ImageConfig,
          category: PackagesCategoryEnum.IMAGES,
          categoryName: PackagesCategoryName.IMAGES,
          package: type,
          dynamic: true,
          chartFrame: ChartFrameEnum.STATIC,
          image: `${requestUrl}/system${i.coverImagePreviewUrl}`,
          dataset: `${requestUrl}/system${i.coverImagePreviewUrl}`,
          title: i.storeFileName,
          name: i.name,
          redirectComponent: `${ImageConfig.package}/${ImageConfig.category}/${ImageConfig.key}`
        })
      })
      packagesStore.setImagePayload('totalPages', res.data.totalPages)
    }
    menuOptions.map((item: MenuOptionsType, index: number) => {
      if (item.key === type) {
        packagesStore.setUpdateList(type, [...imageList])
        menuOptions[index].list = [...imageList]
        if (isUp) {
          selectOptions.value.list = [...imageList]
        }
      }
    })
  }

  const getVideoListReq = async <T extends keyof PackagesType>(type: T, pageNum: number=1, isUp: boolean = false) => {
    const List: Array<ConfigType> = []
    const payload = packagesStore.getVideoPayload
    const param = {
      condition: {
        appType: "led",
        directoryIds: payload.directoryIds,
        examineState: 1,
        type: 'VIDEO',
        fileName: payload.fileName || ''
      },
      pageNum: payload.pageNum || 1,
      pageSize: 10
    }
    const res = await getMediaInfo(param)
    if (res && res.code === ResultEnum.SUCCESS) {
      res.data.data.map((i: any, index: number) => {
        List.push({
          ...VideoConfig,
          category: PackagesCategoryEnum.VIDEOS,
          categoryName: PackagesCategoryName.VIDEOS,
          package: PackagesCategoryEnum.INFORMATIONS,
          chartFrame: ChartFrameEnum.COMMON,
          dynamic: true,
          image: `${requestUrl}/system${i.coverImagePreviewUrl}`,
          dataset: `${requestUrl}/system${i.coverVideoPreviewUrl}`,
          title: `${payload.pageNum + index + i.storeFileName}`,
          name: i.name,
          redirectComponent: `${VideoConfig.package}/${VideoConfig.category}/${VideoConfig.key}`
        })
      })
      packagesStore.setVideoPayload('totalPages', res.data.totalPages)
    }
    menuOptions.map((item: MenuOptionsType, index: number) => {
      if (item.key === type) {
        packagesStore.setUpdateList(type, [...List])
        menuOptions[index].list = [...List]
        if (isUp) {
          selectOptions.value.list = [...List]
        }
      }
    })
  }

  const getTxtListReq = async (pageNum: number=1, isUp: boolean = false) => {
    const List: Array<ConfigType> = []
    const payload = packagesStore.getTxtPayload
    const param = {
      condition: {
        appType: "led",
        directoryIds: payload.directoryIds,
        examineState: 1,
        type: 'Txt',
        fileName: payload.fileName || ''
      },
      pageNum: payload.pageNum || 1,
      pageSize: 10
    }
    const res = await getMediaInfo(param)
    if (res && res.code === ResultEnum.SUCCESS) {
      res.data.data.map((i: any) => {
        const txtContent = getPlainText(i.txtContent)
        List.push({
          ...TextCommonConfig,
          category: PackagesCategoryEnum.TABLES,
          categoryName: PackagesCategoryName.TABLES,
          image: `${requestUrl}/system${i.coverImagePreviewUrl}`,
          title: i.storeFileName,
          name: i.name,
          txtContent: txtContent,
          dataset: txtContent,
          redirectComponent: `${TextCommonConfig.package}/${TextCommonConfig.category}/${TextCommonConfig.key}`
        })
      })
      packagesStore.setTxtPayload('totalPages', res.data.totalPages)
    }
    menuOptions.map((item: MenuOptionsType, index: number) => {
      if (item.key === PackagesCategoryEnum.TABLES) {
        packagesStore.setUpdateList(PackagesCategoryEnum.TABLES, [...List])
        menuOptions[index].list = [...List]
        if (isUp) {
          selectOptions.value.list = [...List]
        }
      }
    })
  }

  const getGroupTree = async () => {
    await getTreeApi({appType: 'led'}).then((res: any)=> {
      if (res && res.code === ResultEnum.SUCCESS) {
        packagesStore.setGroupTree([res.data])
      }
    })
  }

  // 记录选中值
  let beforeSelect: string = menuOptions[0]['key']
  const selectValue = ref<string>(menuOptions[0]['key'])


  // 点击 item
  const clickItemHandle = (key: string, item: any) => {
    // if ( key === PackagesCategoryEnum.IMAGES ||  key === PackagesCategoryEnum.VIDEOS) {
    //   selectOptions.value = packagesStore.getImageList
    // } else {
    // }
    selectOptions.value = item
    // 处理折叠
    if (beforeSelect === key) {
      setItem(ChartLayoutStoreEnum.CHARTS, !getCharts.value, false)
    } else {
      setItem(ChartLayoutStoreEnum.CHARTS, true, false)
    }
    beforeSelect = key
  }

  return {
    getCharts,
    BarChartIcon,
    themeColor,
    selectOptions,
    selectValue,
    clickItemHandle,
    menuOptions,
    getImageListReq,
    getVideoListReq,
    getTxtListReq,
    getGroupTree
  }
}
