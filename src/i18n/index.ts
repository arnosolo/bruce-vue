import { computed, readonly, ref } from 'vue'
import type { App } from 'vue'
import { messages } from './messages'

export const LOCALES = ['zh-CN', 'en-US'] as const
export type Locale = (typeof LOCALES)[number]

const STORAGE_KEY = 'bruce-locale'

const getInitialLocale = (): Locale => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (LOCALES.includes(stored as Locale)) return stored as Locale

  const browserLocale = navigator.language.toLowerCase()
  return browserLocale.startsWith('zh') ? 'zh-CN' : 'en-US'
}

const locale = ref<Locale>(getInitialLocale())

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`))
}

export function setLocale(nextLocale: Locale) {
  locale.value = nextLocale
  localStorage.setItem(STORAGE_KEY, nextLocale)
  syncDocumentMeta()
}

export function t(key: string, params?: Record<string, string | number>) {
  const template = messages[locale.value][key] ?? messages['zh-CN'][key] ?? key
  return interpolate(template, params)
}

function syncDocumentMeta() {
  document.documentElement.lang = locale.value
  document.title = t('app.name')
}

export function useI18n() {
  const languageName = computed(() => locale.value === 'zh-CN' ? t('language.zh') : t('language.en'))
  const nextLocale = computed<Locale>(() => locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
  const toggleLocale = () => setLocale(nextLocale.value)

  return {
    locale: readonly(locale),
    languageName,
    nextLocale,
    setLocale,
    toggleLocale,
    t,
  }
}

export function installI18n(app: App) {
  syncDocumentMeta()
  app.config.globalProperties.$t = t
}
