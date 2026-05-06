import http from '../utils/http'
import type { BaseResponse, UploadResponse } from '../types/api'

export interface HealthData {
  status: string
  database: string
}

/** 健康检查响应 */
export interface HealthResponse extends BaseResponse<HealthData> {}

export const systemApi = {
  /**
   * 检查 API 健康状态
   */
  getHealth(): Promise<HealthResponse> {
    return http.get('/health')
  },

  /**
   * 上传用户头像 (公开访问)
   */
  uploadAvatar(file: File): Promise<BaseResponse<UploadResponse>> {
    const formData = new FormData()
    formData.append('file', file)
    return http.post('/oss/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * 上传聊天附件 (私有访问)
   */
  uploadChatFile(file: File): Promise<BaseResponse<UploadResponse>> {
    const formData = new FormData()
    formData.append('file', file)
    return http.post('/oss/upload/chat', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
