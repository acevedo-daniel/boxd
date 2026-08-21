function normalizeApiBaseUrl(value: string | undefined): string {
  const trimmedValue = value?.trim()

  if (trimmedValue === undefined || trimmedValue.length === 0) {
    return '/api'
  }

  return trimmedValue.replace(/\/+$/, '')
}

export const apiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL)
