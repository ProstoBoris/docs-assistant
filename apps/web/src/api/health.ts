export type DependencyStatus = {
  status: 'up' | 'down'
  message?: string
}

export type HealthResponse = {
  status: 'ok' | 'error' | 'shutting_down'
  details: Record<string, DependencyStatus>
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch('/api/health')

  // The API answers 503 with a body when a dependency is down, so read
  // the body whenever it is JSON. Anything else means the API itself is
  // unreachable, for example when the dev proxy cannot connect.
  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json')
  if (!isJson) {
    throw new Error(`API unreachable (HTTP ${response.status})`)
  }

  return (await response.json()) as HealthResponse
}
