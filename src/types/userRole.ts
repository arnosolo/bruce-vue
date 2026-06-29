import { t } from '../i18n'
import { mapToEnum } from '../utils/mapToEnum'

/**
 * 用户角色定义
 */
export const UserRole = {
  Customer: 'CUSTOMER',
  Agent: 'AGENT',
  AI: 'AI',
  Admin: 'ADMIN',
} as const;

export function getUserRoleLabel(val: unknown) {
  const role = mapToEnum(val, UserRole)
  return role !== undefined ? t(`role.${role}`) : undefined
}

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * 用户角色配置（用于 UI 展示）
 */
export const USER_ROLE_CONFIG = {
  [UserRole.Customer]: { 
    text: '客户', 
    status: 'default', 
    icon: 'i-carbon-user',
    colorClass: 'bg-gray-50 text-gray-600'
  },
  [UserRole.Agent]: { 
    text: '客服', 
    status: 'info', 
    icon: 'i-carbon-headset',
    colorClass: 'bg-blue-50 text-blue-600'
  },
  [UserRole.AI]: { 
    text: '小黄', 
    status: 'success', 
    icon: 'i-carbon-bot',
    colorClass: 'bg-emerald-50 text-emerald-600'
  },
  [UserRole.Admin]: { 
    text: '管理员', 
    status: 'warning', 
    icon: 'i-carbon-user-settings',
    colorClass: 'bg-purple-50 text-purple-600'
  },
} as const;

/**
 * 获取角色配置
 */
export function getUserRoleConfig(val: unknown) {
  const role = mapToEnum(val, UserRole);
  return role !== undefined ? USER_ROLE_CONFIG[role] : undefined;
}
