import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'

export const DateConfig: ConfigType = {
  key: 'Date',
  chartKey: 'VDate',
  conKey: 'VCDate',
  title: '通用日期',
  category: ChatCategoryEnum.COMP,
  categoryName: ChatCategoryEnumName.COMP,
  package: PackagesCategoryEnum.COMPS,
  chartFrame: ChartFrameEnum.STATIC,
  image: 'date.png'
}
