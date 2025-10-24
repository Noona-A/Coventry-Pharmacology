// Helper to get the correct asset path for both development and production
export function getAssetPath(path: string): string {
  const base = import.meta.env.BASE_URL
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  // Ensure base ends with slash
  const baseWithSlash = base.endsWith('/') ? base : base + '/'
  return baseWithSlash + cleanPath
}
