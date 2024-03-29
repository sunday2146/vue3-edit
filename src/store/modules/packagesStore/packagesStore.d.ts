import { PackagesType, ConfigType, ImagePayloadType } from '@/packages/index.d'

export { ConfigType }

export { PackagesType }
export interface PackagesStoreType {
  packagesList: PackagesType,
  newPhoto?: ConfigType,
  imageList: Array<ConfigType>,
  imagePayload: ImagePayloadType,
  videoPayload: ImagePayloadType,
  txtPayload: ImagePayloadType
}
