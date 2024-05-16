import { http } from '@/api/http'
import { httpErrorHandle } from '@/utils'
import { ContentTypeEnum, RequestHttpEnum, ModuleTypeEnum } from '@/enums/httpEnum'
import { ProjectItem, ProjectDetail } from './project'


// * 左侧树列表
export const getTreeApi = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.GET)<ProjectItem[]>(`${ModuleTypeEnum.SYSTEM}/directory/tree`, data)
    return res
  } catch {
    httpErrorHandle()
  }
}

// * 素材列表
export const postMediaApi = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.POST)<ProjectItem[]>(`${ModuleTypeEnum.SYSTEM}/mediaInfo/pageList`, data)
    return res
  } catch {
    httpErrorHandle()
  }
}

// * 项目列表
export const projectListApi = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.GET)<ProjectItem[]>(`${ModuleTypeEnum.PROJECT}/list`, data)
    return res
  } catch {
    httpErrorHandle()
  }
}

// * 新增项目
export const createProjectApi = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.POST)<{
      /**
       * 项目id
       */
      id: number
    }>(`${ModuleTypeEnum.PROJECT}/create`, data)
    return res
  } catch {
    httpErrorHandle()
  }
}

// * 设备列表
export const getFacilityListApi = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.GET)<ProjectDetail>(`${ModuleTypeEnum.ISLANDBUSINESS}/api/group/listAndSubDevice`, data)
    return res
  } catch {
    httpErrorHandle()
  }
}

// * 获取项目
export const fetchProjectApi = async (data: { projectId: string }) => {
  try {
    const res = await http(RequestHttpEnum.GET)<ProjectDetail>(`${ModuleTypeEnum.ISLANDAMS}/led/program/${data.projectId}`)
    return res
  } catch {
    httpErrorHandle()
  }
}

// * 保存项目
export const saveProjectApi = async (data: {
  id: string }) => {
  try {
    const res = await http(Number(data.id) ? RequestHttpEnum.PUT : RequestHttpEnum.POST)(
      `${ModuleTypeEnum.ISLANDAMS}/led/program`,
      data
    )
    return res
  } catch {
    httpErrorHandle()
  }
}

export const ledStrategyApi = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.POST)(
        `${ModuleTypeEnum.ISLANDAMS}/led/strategy`,
        data
    )
    return res
  } catch {
    httpErrorHandle()
  }
}
// * 修改项目基础信息
export const updateProjectApi = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.POST)(`${ModuleTypeEnum.PROJECT}/edit`, data)
    return res
  } catch {
    httpErrorHandle()
  }
}

// * 删除项目
export const deleteProjectApi = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.DELETE)(`${ModuleTypeEnum.PROJECT}/delete`, data)
    return res
  } catch {
    httpErrorHandle()
  }
}

// * 修改发布状态 [-1未发布,1发布]
export const changeProjectReleaseApi = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.PUT)(`${ModuleTypeEnum.PROJECT}/publish`, data)
    return res
  } catch {
    httpErrorHandle()
  }
}

// * 上传文件
export const uploadFile = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.POST)<{
      /**
       * 文件地址
       */
      id: string,
      tenantId: string,
      name: string,
      downloadUrl: string,
      previewUrl: string,
      storeFileName: string,
    }>(`${ModuleTypeEnum.SYSTEM}/mediaInfo/upload?appType=led&directoryId=0`, data, ContentTypeEnum.FORM_DATA)
    return res
  } catch {
    httpErrorHandle()
  }
}

// * 上传节目制作封面
export const uploadImageByBase64 = async (data: string) => {
  try {
    // @ts-ignore
    const res = await http(RequestHttpEnum.POST)<{
      /**
       * 文件地址
       */
      fileName: string,
      fileurl: string,
    }>(`${ModuleTypeEnum.SYSTEM}/mediaInfo/uploadImageByBase64`, data as any)
    return res
  } catch {
    httpErrorHandle()
  }
}

// * 获取资源库素材
export const getMediaInfo = async (data: object) => {
  try {
    const res = await http(RequestHttpEnum.POST)(`${ModuleTypeEnum.SYSTEM}/mediaInfo/pageList2`, data)
    return res
  } catch {
    httpErrorHandle()
  }
}