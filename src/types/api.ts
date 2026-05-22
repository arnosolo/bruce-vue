/**
 * 基础 API 响应接口
 */
export interface BaseResponse<T = any> {
  /** 是否请求成功 */
  success: boolean
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data?: T
}

/**
 * 分页信息
 */
export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * OSS 上传响应数据
 */
export interface UploadResponse {
  /** 文件在 OSS 中的原始名称 */
  name: string
  /** 文件的访问链接 (公开目录为固定链接，私有目录为签名链接) */
  url: string
  /** 文件在 OSS 中的完整路径 (Key) */
  key: string
}
