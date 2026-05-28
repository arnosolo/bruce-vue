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

/** 注册响应 */
export interface RegisterResponse extends BaseResponse<AuthData> {}

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
