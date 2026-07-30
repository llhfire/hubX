/**
 * 轻量级 HTML 净化工具 — 用于 dangerouslySetInnerHTML 场景
 * 移除 <script> 标签、on* 事件处理器、javascript: 协议等 XSS 攻击面
 *
 * 注：生产环境建议替换为 DOMPurify 以获得更完善的保护
 */

export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // 1. 移除 <script>...</script> 及自闭合 <script ... />
  let safe = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  safe = safe.replace(/<script\b[^>]*\/>/gi, '');

  // 2. 移除 on* 事件处理器属性（如 onclick, onerror, onload 等）
  safe = safe.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 3. 移除 javascript: 协议（在 href / src / action 等属性中）
  safe = safe.replace(/(href|src|action)\s*=\s*(['"]?)\s*javascript\s*:/gi, '$1=$2#');

  // 4. 移除 <iframe>, <object>, <embed>, <form> 等高危标签
  safe = safe.replace(/<\/?(?:iframe|object|embed|form|base|meta|link)\b[^>]*>/gi, '');

  // 5. 移除 style 属性中的 expression() 和 url(javascript:)
  safe = safe.replace(/style\s*=\s*(['"])[^'"]*expression\s*\([^'"]*\1/gi, '');
  safe = safe.replace(/style\s*=\s*(['"])[^'"]*url\s*\(\s*['"]?\s*javascript\s*:[^'"]*\1/gi, '');

  return safe;
}
