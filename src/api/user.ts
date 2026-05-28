import http from '../utils/http'
import type { 
  User, 
  UserListParams, 
  UserListResponse, 
  UpdateUserRoleParams 
} from '../types/user'
import type { BaseResponse } from '../types/api'

export const userApi = {
  /**
   * 获取用户列表
   */
  getUsers(params?: UserListParams): Promise<UserListResponse> {
    return http.get('/auth/users', { params })
  },

  /**
   * 更新用户角色
   */
  updateRole(id: number, data: UpdateUserRoleParams): Promise<BaseResponse<User>> {
    return http.patch(`/auth/users/${id}/role`, data)
  }
}
