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
  }
}
