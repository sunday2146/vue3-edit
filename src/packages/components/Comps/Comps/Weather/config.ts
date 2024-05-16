import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import {WeatherConfig} from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export enum FontWeightEnum {
  CHANGSHA = '长沙',
  BEIJIN = '北京',
  SHENZHEN = '深圳'
}

export const FontWeightObject = {
  [FontWeightEnum.CHANGSHA]: 'normal',
  [FontWeightEnum.BEIJIN]: 'bold',
  [FontWeightEnum.SHENZHEN]: 'shenzhen'
}

export const option = {
  // 数据说明
  timeSize: 24,
  timeLineHeight: 50,
  timeTextIndent: 2,
  timeColor: '#E6F7FF',
  fontWeight: 'normal',

  //阴影
  showShadow:  true,
  hShadow: 0,
  vShadow: 0,
  blurShadow: 8,
  colorShadow: '#0075ff'
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = WeatherConfig.key
  public attr = { ...chartInitConfig, w: 300, h: 50, zIndex: -1 }
  public chartConfig = cloneDeep(WeatherConfig)
  public option = cloneDeep(option)
}
