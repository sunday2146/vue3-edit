import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { VideoConfig } from '@/packages/components/Informations/Mores/Video/index'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const StreamConfig: ConfigType = {
  ...VideoConfig,
  category: ChatCategoryEnum.COMP,
  categoryName: ChatCategoryEnumName.COMP,
  package: PackagesCategoryEnum.COMPS,
  redirectComponent: `${VideoConfig.package}/${VideoConfig.category}/${VideoConfig.key}` // 跳转组件路径规则：packageName/categoryName/componentKey
}

