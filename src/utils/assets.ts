// Helper to get the correct asset path for both development and production
export function getAssetPath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  // In production, BASE_URL will be '/Coventry-Pharmacology/'
  // In development, BASE_URL will be '/'
  return import.meta.env.BASE_URL + cleanPath
}
