import { ConfigType,PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const WeatherConfig: ConfigType = {
  key: 'Weather',
  chartKey: 'VWeather',
  conKey: 'VCWeather',
  category: ChatCategoryEnum.COMP,
  categoryName: ChatCategoryEnumName.COMP,
  package: PackagesCategoryEnum.COMPS,
  image: 'weather.png',
  // chartFrame: ChartFrameEnum.STATIC,
  // icon: 'wi:day-sunny-overcast',
  dataset: 'wi:day-sunny-overcast',
  title: '天气',
}

