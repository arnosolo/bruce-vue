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

export interface ProfileResponse {
  success: boolean
  data: User
}

export interface UpdateProfileParams {
  name?: string
}

export interface UpdateProfileResponse {
  success: boolean
  message: string
  data: User
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
  },

  /**
   * Get current user profile
   */
  getProfile(): Promise<ProfileResponse> {
    return http.get('/auth/me')
  },

  /**
   * Update current user profile
   */
  updateProfile(data: UpdateProfileParams): Promise<UpdateProfileResponse> {
    return http.put('/auth/me', data)
  }
}
