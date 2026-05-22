import {
  defineConfig,
  presetIcons,
  presetUno
} from 'unocss'

export default defineConfig({
  shortcuts: [
  ],
  // 由于角色图标是通过变量动态拼接的，UnoCSS 静态分析无法识别，
  // 需要在此配置白名单以确保这些图标类始终被生成。
  safelist: [
    'i-carbon-user',
    'i-carbon-headset',
    'i-carbon-bot',
    'i-carbon-user-settings',
    'i-carbon-chat',
    'i-carbon-send-alt',
    'i-carbon-user-favorite',
    'i-carbon-grid',
    'i-carbon-flash',
    'i-carbon-logo-github',
  ],
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
})
