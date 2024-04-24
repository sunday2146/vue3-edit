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
    groupTree: [],
    imagePayload: {
      pageNum: 1,
      pageSize: 10,
      totalPages: 1,
      directoryId: '',
      directoryIds: [],
      fileName: ''
    },
    videoPayload: {
      pageNum: 1,
      pageSize: 10,
      totalPages: 1,
      directoryId: '',
      directoryIds: [],
      fileName: ''
    },
    txtPayload: {
      pageNum: 1,
      pageSize: 10,
      totalPages: 1,
      directoryId: '',
      directoryIds: [],
      fileName: ''
    }
  }),
  getters: {
    getPackagesList(): PackagesType {
      return this.packagesList
    },
    getGroupTree(): any[] {
      return this.groupTree
    },
    getImageList(): Array<ConfigType> {
      return this.imageList
    },
    getImagePayload(): ImagePayloadType {
      return this.imagePayload
    },
    getVideoPayload(): ImagePayloadType {
      return this.videoPayload
    },
    getTxtPayload(): ImagePayloadType {
      return this.txtPayload
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
    setGroupTree(data: any[]) {
      this.groupTree = data
    },
    setUpdateList<T extends keyof PackagesType>(key: T, list: Array<ConfigType>): void {
      this.packagesList[key] = [...list]
      // list.map(item => {
      //   this.packagesList[key].push(list)
      // })
      // this.imageList = list
    },
    setImagePayload<T extends keyof ImagePayloadType>(key: T, val: number | string | any): void {
      this.imagePayload[key] = val
    },
    setVideoPayload<T extends keyof ImagePayloadType>(key: T, val: number | string | any): void {
      this.videoPayload[key] = val
    },
    setTxtPayload<T extends keyof ImagePayloadType>(key: T, val: number | string | any): void {
      this.txtPayload[key] = val
    }
  }
})
