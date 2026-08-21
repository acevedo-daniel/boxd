import { apiBaseUrl } from '../config/environment'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function getApiUrl(path: string): string {
  return `${apiBaseUrl}/${path.replace(/^\/+/, '')}`
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(getApiUrl(path), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, `API request failed with status ${response.status}.`)
  }

  return (await response.json()) as T
}
