import type {
  SearchParams,
  SearchResponse,
  PassageParams,
  PassageResponse,
  ApiError,
} from './types'

const BASE = '/api/v1'

class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiError,
  ) {
    super(body.detail ?? `HTTP ${status}`)
    this.name = 'ApiClientError'
  }
}

async function request<T>(path: string, params: Record<string, unknown> = {}): Promise<T> {
  const url = new URL(BASE + path, window.location.origin)

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  }

  const res = await fetch(url.toString())

  if (!res.ok) {
    let body: ApiError = {}
    try {
      body = (await res.json()) as ApiError
    } catch {
      /* ignore parse failure */
    }
    throw new ApiClientError(res.status, body)
  }

  return res.json() as Promise<T>
}

export const api = {
  search(params: SearchParams): Promise<SearchResponse> {
    return request<SearchResponse>('/search', params as unknown as Record<string, unknown>)
  },

  passage(params: PassageParams): Promise<PassageResponse> {
    return request<PassageResponse>('/passage', params as unknown as Record<string, unknown>)
  },
}

export { ApiClientError }
