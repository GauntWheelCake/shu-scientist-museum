export function withBasePath(source: string, baseUrl = import.meta.env.BASE_URL): string {
  if (!source.startsWith('/') || source.startsWith('//') || baseUrl === '/') return source;

  const normalizedBase = `/${baseUrl.replace(/^\/+|\/+$/g, '')}/`;
  if (source.startsWith(normalizedBase)) return source;

  return `${normalizedBase.slice(0, -1)}${source}`;
}
