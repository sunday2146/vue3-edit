import { defineStore } from 'pinia'
import { ConfigType, PackagesStoreType, PackagesType } from './packagesStore.d'
import { ImagePayloadType } from '@/packages/index.d'
import { packagesList } from '@/packages/index'
import { StorageEnum } from '@/enums/storageEnum'
import { getLocalStorage, setLocalStorage } from '@/utils'

// 组件 packages
export const usePackagesStore = defineStore({
  id: 'usePackagesStore',
  state: (): PackagesStoreType => ({
    packagesList: packagesList,
    newPhoto: undefined,
    imageList: [],
    imagePayload: {
      pageNum: 1,
      pageSize: 10,
      totalPages: 1
    }
  }),
  getters: {
    getPackagesList(): PackagesType {
      return this.packagesList
    },
    getImageList(): Array<ConfigType> {
      return this.imageList
    },
    getImagePayload(): ImagePayloadType {
      return this.imagePayload
    }
  },
  actions: {
    addPhotos(newPhoto: ConfigType, index: number) {
      this.newPhoto = newPhoto
      this.packagesList.Photos.splice(index, 0, newPhoto)
    },
    deletePhotos(photoInfo: ConfigType, index: number) {
      this.packagesList.Photos.splice(index, 1)
      const StoreKey = StorageEnum.GO_USER_MEDIA_PHOTOS
      const userPhotosList = getLocalStorage(StoreKey)
      userPhotosList.splice(index - 1, 1)
      setLocalStorage(StoreKey, userPhotosList)
    },
    setUpdateList<T extends keyof PackagesType>(key: T, list: Array<ConfigType>): void {
      this.packagesList[key] = list
      this.imageList = list
    },
    setImagePayload<T extends keyof ImagePayloadType>(key: T, val: number): void {
      this.imagePayload[key] = val
    }
  }
})
