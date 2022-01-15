import TableCommon from './index.vue'
import image from '@/assets/images/chart/Tables/tables.png'
import { ConfigType } from '@/packages/index.d'
import { ChatCategoryEnum } from '../index.d'

export const tableCommonConfig: ConfigType = {
  key: 'Border',
  title: '表格',
  category: ChatCategoryEnum.table,
  node: TableCommon,
  image
}
