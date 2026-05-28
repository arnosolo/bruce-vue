import type { Pagination } from './api'

/**
 * 常见问题 (FAQ) 相关的类型定义
 */
export interface Faq {
  /** 问题 ID */
  id: number
  /** 问题内容 */
  question: string
  /** 回答内容 */
  answer: string
  /** 向量化模型 */
  embeddingModel?: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/**
 * 创建常见问题的请求体
 */
export interface CreateFaqRequest {
  question: string
  answer: string
}

/**
 * 更新常见问题的请求体
 */
export interface UpdateFaqRequest {
  question?: string
  answer?: string
}

/**
 * 常见问题列表请求参数
 */
export interface FaqListParams {
  page?: number
  limit?: number
  keyword?: string
}

/**
 * 重新生成向量请求参数
 */
export interface RebuildFaqVectorsParams {
  force?: boolean
}

/**
 * 常见问题列表响应
 */
export interface FaqListResponse {
  list: Faq[]
  pagination: Pagination
}
