import http from '../utils/http'
import type { User } from '../types/user'
import type { UserRole } from '../types/userRole'
import type { BaseResponse, Pagination } from '../types/api'

export interface UserListParams {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
}

export interface UserListResponse extends BaseResponse<{
  list: User[]
  pagination: Pagination
}> {}

export interface UpdateUserRoleParams {
  role: UserRole
}

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
