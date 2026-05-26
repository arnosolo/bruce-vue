import http from '../utils/http'
import type { BaseResponse } from '../types/api'
import type { CreateFaqRequest, UpdateFaqRequest, FaqListResponse } from '../types/faq'

/**
 * 常见问题 (FAQ) 相关的 API 调用
 */
export const faqApi = {
  /**
   * 获取常见问题列表
   */
  getFaqs(params?: { page?: number; limit?: number; keyword?: string }): Promise<BaseResponse<FaqListResponse>> {
    return http.get('/faqs', { params })
  },

  /**
   * 创建常见问题
   */
  createFaq(data: CreateFaqRequest): Promise<BaseResponse<void>> {
    return http.post('/faqs', data)
  },

  /**
   * 更新常见问题
   */
  updateFaq(id: number, data: UpdateFaqRequest): Promise<BaseResponse<void>> {
    return http.put(`/faqs/${id}`, data)
  },

  /**
   * 删除常见问题
   */
  deleteFaq(id: number): Promise<BaseResponse<void>> {
    return http.delete(`/faqs/${id}`)
  },

  /**
   * 重新生成所有 FAQ 的向量
   */
  rebuildFaqVectors(params?: { force?: boolean }): Promise<BaseResponse<void>> {
    return http.post('/faqs/rebuild', {}, { params })
  }
}
