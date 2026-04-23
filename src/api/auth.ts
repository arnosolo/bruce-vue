import http from '../utils/http'
import type { User } from '../types/user'
import type { BaseResponse } from '../types/api'

/**
 * 接口特定的数据传输对象 (DTOs)
 */
export interface AuthData {
  /** 认证令牌 */
  token: string
  /** 用户信息 */
  user: User
}

export interface LoginParams {
  /** 电子邮箱 */
  email: string
  /** 密码 */
  password: string
}

/** 登录响应 */
export interface LoginResponse extends BaseResponse<AuthData> {}

export interface RegisterParams {
  /** 电子邮箱 */
  email: string
  /** 密码 */
  password: string
  /** 用户姓名 */
  name?: string
}

/** 注册响应 */
export interface RegisterResponse extends BaseResponse<AuthData> {}

/** 获取个人资料响应 */
export interface ProfileResponse extends BaseResponse<User> {}

export interface UpdateProfileParams {
  /** 用户姓名 */
  name?: string
}

/** 更新个人资料响应 */
export interface UpdateProfileResponse extends BaseResponse<User> {}

export interface ChangePasswordParams {
  /** 旧密码 */
  oldPassword: string
  /** 新密码 */
  newPassword: string
}

/** 修改密码响应 */
export interface ChangePasswordResponse extends BaseResponse<void> {}

/** 注销账号响应 */
export interface DeleteAccountResponse extends BaseResponse<void> {}

/**
 * 身份认证相关的 API 调用
 */
export const authApi = {
  /**
   * 用户登录
   */
  login(data: LoginParams): Promise<LoginResponse> {
    return http.post('/auth/login', data)
  },

  /**
   * 用户注册
   */
  register(data: RegisterParams): Promise<RegisterResponse> {
    return http.post('/auth/register', data)
  },

  /**
   * 获取当前用户信息
   */
  getProfile(): Promise<ProfileResponse> {
    return http.get('/auth/me')
  },

  /**
   * 更新当前用户信息
   */
  updateProfile(data: UpdateProfileParams): Promise<UpdateProfileResponse> {
    return http.put('/auth/me', data)
  },

  /**
   * 修改当前用户密码
   */
  changePassword(data: ChangePasswordParams): Promise<ChangePasswordResponse> {
    return http.put('/auth/password', data)
  },

  /**
   * 注销当前用户账号
   */
  deleteAccount(): Promise<DeleteAccountResponse> {
    return http.delete('/auth/me')
  }
}
