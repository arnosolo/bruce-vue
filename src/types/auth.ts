import type { User } from './user'
import type { BaseResponse } from './api'

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

/** 注册响应 - 注意：新版 API 注册后不直接返回 token，需验证邮箱 */
export interface RegisterResponse extends BaseResponse<{ user: User }> {}

/** 验证邮箱参数 */
export interface VerifyEmailParams {
  /** 电子邮箱 */
  email: string
  /** 6位验证码 */
  code: string
}

/** 验证邮箱响应 */
export interface VerifyEmailResponse extends BaseResponse<void> {}

/** 重发验证码参数 */
export interface ResendCodeParams {
  /** 电子邮箱 */
  email: string
}

/** 重发验证码响应 */
export interface ResendCodeResponse extends BaseResponse<void> {}

/** 获取个人资料响应 */
export interface ProfileResponse extends BaseResponse<User> {}

export interface UpdateProfileParams {
  /** 用户姓名 */
  name?: string
  /** OSS 中的头像路径 (例如 public/avatar/...) */
  avatarKey?: string
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
