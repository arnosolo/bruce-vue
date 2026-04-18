import http from '../utils/http'

export interface HealthResponse {
  success: boolean
  message: string
  data: {
    status: string
    database: string
  }
}

export const systemApi = {
  /**
   * Check API health status
   */
  getHealth(): Promise<HealthResponse> {
    return http.get('/health')
  }
}
