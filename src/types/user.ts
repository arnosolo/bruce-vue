import type { UserRole } from "./userRole";

export interface User {
  /** 用户唯一标识 ID */
  id: number
  /** 用户邮箱地址 */
  email: string
  /** 用户姓名 */
  name: string | null
  /** 用户角色 */
  role: UserRole
  /** OSS 中的头像路径 */
  avatarKey?: string | null
  /** 头像的可访问 URL */
  avatarUrl?: string | null
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}
