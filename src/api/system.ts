import http from '../utils/http'
import type { BaseResponse } from '../types/api'

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
   * 后端直接上传文件
   */
  uploadFile(file: File): Promise<BaseResponse<{ name: string; url: string; key: string }>> {
    const formData = new FormData()
    formData.append('file', file)
    return http.post('/oss/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
