import { defineStore } from 'pinia'
import { PagesStateType } from './pagesStore.d'
import { setLocalStorage, getLocalStorage, reloadRoutePage } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'

const { GO_PAGES_STORE } = StorageEnum
const storagePages: PagesStateType = getLocalStorage(GO_PAGES_STORE)

// 语言
export const usePagesStore = defineStore({
  id: 'usePagesStore',
  state: (): PagesStateType =>
    storagePages || {
      pages: ['分页1']
    },
  getters: {
    getPages(): Array<string> {
      return this.pages
    }
  },
  actions: {
    changePages(pages: Array<string>): void {
      this.pages = pages
      setLocalStorage(GO_PAGES_STORE, this.$state)
    }
  }
})
