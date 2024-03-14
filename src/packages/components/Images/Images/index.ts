import { onMounted } from 'vue'
import { ChartFrameEnum, PackagesCategoryEnum } from '@/packages/index.d'
import { ImageConfig } from '@/packages/components/Informations/Mores/Image/index'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../index.d'
import { usePackagesStore } from '@/store/modules/packagesStore/packagesStore'
import {getMediaInfo} from '@/api/path'
import {ResultEnum} from "@/enums/httpEnum";

// 远程共享库（调接口获取图像列表）
const imageList = [
  { imageName: 'carousel1', imageUrl: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg' },
  { imageName: 'carousel2', imageUrl: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg' }
]

const imageConfigList = imageList.map(i => ({
  ...ImageConfig,
  category: ChatCategoryEnum.IMAGES,
  categoryName: ChatCategoryEnumName.IMAGES,
  package: PackagesCategoryEnum.IMAGES,
  chartFrame: ChartFrameEnum.STATIC,
  image: i.imageUrl,
  dataset: i.imageUrl,
  title: i.imageName,
  redirectComponent: `${ImageConfig.package}/${ImageConfig.category}/${ImageConfig.key}` // 跳转组件路径规则：packageName/categoryName/componentKey
}))

export default imageConfigList
