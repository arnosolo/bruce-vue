import { marked } from 'marked'
import DOMPurify from 'dompurify'

/**
 * 将 Markdown 字符串安全地渲染为 HTML
 */
export function renderMarkdown(content: string): string {
  if (!content) return ''
  
  // 配置 marked
  const rawHtml = marked.parse(content, {
    gfm: true, // 启用 GitHub 风格的 Markdown
    breaks: true, // 启用换行符
  })
  
  // 使用 DOMPurify 净化 HTML，防止 XSS
  return DOMPurify.sanitize(rawHtml as string)
}
