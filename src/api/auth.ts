import http from '../utils/http'
import type { User } from '../types/user'

/**
 * API Specific Data Transfer Objects (DTOs)
 */
export interface AuthData {
  token: string
  user: User
}

export interface LoginParams {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: AuthData
}

export interface RegisterParams {
  email: string
  password: string
  name?: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  data: AuthData
}

/**
 * Authentication related API calls
 */
export const authApi = {
  /**
   * User login
   */
  login(data: LoginParams): Promise<LoginResponse> {
    return http.post('/auth/login', data)
  },

  /**
   * User registration
   */
  register(data: RegisterParams): Promise<RegisterResponse> {
    return http.post('/auth/register', data)
  }
}
