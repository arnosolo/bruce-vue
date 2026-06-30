import http from '../utils/http'
import type { 
  LoginParams, 
  LoginResponse, 
  RegisterParams, 
  RegisterResponse, 
  VerifyEmailParams,
  VerifyEmailResponse,
  ResendCodeParams,
  ResendCodeResponse,
  SendLoginCodeParams,
  SendLoginCodeResponse,
  LoginByCodeParams,
  LoginByCodeResponse,
  ProfileResponse, 
  UpdateProfileParams, 
  UpdateProfileResponse, 
  ChangePasswordParams, 
  ChangePasswordResponse, 
  DeleteAccountResponse 
} from '../types/auth'

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
   * 验证邮箱
   */
  verifyEmail(data: VerifyEmailParams): Promise<VerifyEmailResponse> {
    return http.post('/auth/verify-email', data)
  },

  /**
   * 重发验证码
   */
  resendCode(data: ResendCodeParams): Promise<ResendCodeResponse> {
    return http.post('/auth/resend-code', data)
  },

  /**
   * 发送登录验证码（免注册登录第一步）
   */
  sendLoginCode(data: SendLoginCodeParams): Promise<SendLoginCodeResponse> {
    return http.post('/auth/send-login-code', data)
  },

  /**
   * 验证码登录（免注册登录第二步）
   */
  loginByCode(data: LoginByCodeParams): Promise<LoginByCodeResponse> {
    return http.post('/auth/login-by-code', data)
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
