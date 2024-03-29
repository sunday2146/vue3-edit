import { onMounted } from 'vue'
import { ChartFrameEnum, ConfigType } from '@/packages/index.d'
import { ImageConfig } from '@/packages/components/Informations/Mores/Image/index'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../index.d'
import { usePackagesStore } from '@/store/modules/packagesStore/packagesStore'
import {getMediaInfo} from '@/api/path'
import {ResultEnum} from "@/enums/httpEnum";

// 远程共享库（调接口获取图像列表）
const imageConfigList: Array<ConfigType> = []

export default imageConfigList
