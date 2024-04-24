import { ChartEditStorage } from '@/store/modules/chartEditStore/chartEditStore.d'

export interface ChartEditStorageType extends ChartEditStorage {
  id: string,
  isRelease?: boolean
  switchPreviewPage(index: number): void;
}