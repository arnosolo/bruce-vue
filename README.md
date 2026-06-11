# 聪明小黄 Web 前端

AI 客服后端, 支持回复常见问题和修改用户资料.

## 技术栈

- **框架**: Vue 3.5+
- **语言**: TypeScript 6.0+
- **构建工具**: Vite 8.0+
- **状态管理**: Pinia 3.0+
- **路由**: Vue Router 4.6+
- **样式**: UnoCSS 66.6+ (原子化 CSS)
- **HTTP 客户端**: Axios 1.15+

## 项目结构

```
src/
├── api/          # API 接口定义
├── assets/       # 静态资源
├── components/   # 可复用组件
├── constants/    # 常量配置
├── router/       # 路由配置
├── stores/       # Pinia 状态管理
├── types/        # TypeScript 类型定义
├── utils/        # 工具函数
├── views/        # 页面视图
├── App.vue       # 根组件
└── main.ts       # 入口文件
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 开发环境配置

项目使用 `.env.development` 和 `.env.production` 文件进行环境配置。

## 资源

### 源码

- [Node.js 后端](https://github.com/arnosolo/ai-customer-service)
- [Web 前端](https://github.com/arnosolo/ai-customer-service-vue)

### 参考文档

- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
