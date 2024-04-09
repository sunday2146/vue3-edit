import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { chartInitConfig } from '@/settings/designSetting'
import { IframeConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
const dataset = import.meta.env.VITE_PRO_PATH

export const option = {
  // 网站路径
  dataset,
  // 圆角
  borderRadius: 10
}

export default class Config extends PublicConfigClass implements CreateComponentType
{
  public key = IframeConfig.key
  public attr = { ...chartInitConfig, w: 1200, h: 800, zIndex: -1 }
  public chartConfig = cloneDeep(IframeConfig)
  public option = cloneDeep(option)
}
