import { enUS } from './locales/en-US'
import { zhCN } from './locales/zh-CN'
import type { Messages } from './types'
import type { Locale } from './index'

export const messages: Record<Locale, Messages> = {
  'zh-CN': zhCN,
  'en-US': enUS,
}
