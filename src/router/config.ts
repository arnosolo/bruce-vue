// 公开路由：完整路径
export const PUBLIC_PATHS = new Set([
  '/',
  '/auth',
  '/about',
])

// 公开路径前缀（匹配 /docs/xxx）
export const PUBLIC_PATH_PREFIXES = ['/docs/']

// 权限路由：路径 => 允许角色
export const PATH_ROLE_MAP: Record<string, string[]> = {
  '/user-management': ['ADMIN'],
  '/faq-management': ['ADMIN', 'AGENT']
}
