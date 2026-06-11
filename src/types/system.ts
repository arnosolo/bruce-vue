import type { BaseResponse } from './api'

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

export type SystemStatus = (typeof SystemStatus)[keyof typeof SystemStatus];

/**
 * 系统状态配置
 */
export const SYSTEM_STATUS_CONFIG = {
  [SystemStatus.Online]: {
    text: '服务器状态: 在线',
    dotClass: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse',
    textClass: 'text-green-600'
  },
  [SystemStatus.Offline]: {
    text: '服务器状态: 离线',
    dotClass: 'bg-red-500',
    textClass: 'text-red-600'
  },
  [SystemStatus.Checking]: {
    text: '服务器状态: 检查中',
    dotClass: 'bg-yellow-500',
    textClass: 'text-yellow-600'
  },
} as const;
