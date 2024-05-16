import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { IframeConfig } from '@/packages/components/Informations/Mores/Iframe/index'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const WebUrlConfig: ConfigType = {
  ...IframeConfig,
  category: ChatCategoryEnum.COMP,
  categoryName: ChatCategoryEnumName.COMP,
  package: PackagesCategoryEnum.COMPS,
  redirectComponent: `${IframeConfig.package}/${IframeConfig.category}/${IframeConfig.key}` // 跳转组件路径规则：packageName/categoryName/componentKey
}

