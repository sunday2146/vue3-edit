import { ChartFrameEnum, PackagesCategoryEnum } from '@/packages/index.d'
import { VideoConfig } from '@/packages/components/Informations/Mores/Video/index'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../index.d'

// 远程共享库（调接口获取图像列表）
const list = [
    { imageName: 'carousel1444', imageUrl: 'https://hnaiot.leyard.com:6443/system/mediaInfo/download/1214977966149525504' }
]

const videoConfigList = list.map(i => ({
    ...VideoConfig,
    category: ChatCategoryEnum.VIDEOS,
    categoryName: ChatCategoryEnumName.VIDEOS,
    package: PackagesCategoryEnum.VIDEOS,
    chartFrame: ChartFrameEnum.STATIC,
    image: i.imageUrl,
    title: i.imageName,
    redirectComponent: `${VideoConfig.package}/${VideoConfig.category}/${VideoConfig.key}` // 跳转组件路径规则：packageName/categoryName/componentKey
}))


export default videoConfigList
