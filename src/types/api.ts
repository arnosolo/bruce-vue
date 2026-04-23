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
