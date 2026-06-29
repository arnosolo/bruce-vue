import type { BaseResponse } from './api'
import { t } from '../i18n'

export interface HealthData {
  status: string
  database: string
}

/** 健康检查响应 */
export interface HealthResponse extends BaseResponse<HealthData> {}

/**
 * 系统健康状态类型
 */
export const SystemStatus = {
  Online: 'online',
  Offline: 'offline',
  Checking: 'checking',
} as const;

export function getSystemStatusText(status: SystemStatus) {
  return t(`status.${status}`)
}

export type SystemStatus = (typeof SystemStatus)[keyof typeof SystemStatus];

/**
 * 系统状态配置
 */
export const SYSTEM_STATUS_CONFIG = {
  [SystemStatus.Online]: {
    text: '服务器状态: 在线',
    bgColor: '#22c55e',   // bg-green-500
    textColor: '#16a34a'   // text-green-600
  },
  [SystemStatus.Offline]: {
    text: '服务器状态: 离线',
    bgColor: '#ef4444',   // bg-red-500
    textColor: '#dc2626'  // text-red-600
  },
  [SystemStatus.Checking]: {
    text: '服务器状态: 检查中',
    bgColor: '#eab308',   // bg-yellow-500
    textColor: '#ca8a04'  // text-yellow-600
  },
} as const;
