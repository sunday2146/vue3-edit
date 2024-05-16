import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'

export const TimeConfig: ConfigType = {
  key: 'Time',
  chartKey: 'VTime',
  conKey: 'VCTime',
  title: '通用时间',
  category: ChatCategoryEnum.COMP,
  categoryName: ChatCategoryEnumName.COMP,
  package: PackagesCategoryEnum.COMPS,
  chartFrame: ChartFrameEnum.STATIC,
  image: 'time.png'
}
