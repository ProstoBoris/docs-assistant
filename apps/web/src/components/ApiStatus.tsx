import { useQuery } from '@tanstack/react-query'
import { fetchHealth } from '../api/health'

type Tone = 'pending' | 'ok' | 'degraded' | 'down'

export function ApiStatus() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchInterval: 15_000,
    retry: false,
  })

  let tone: Tone
  let label: string
  if (isPending) {
    tone = 'pending'
    label = 'Checking API…'
  } else if (isError) {
    tone = 'down'
    label = 'API unreachable'
  } else if (data.status === 'ok') {
    tone = 'ok'
    label = 'API online'
  } else {
    const down = Object.entries(data.details)
      .filter(([, dependency]) => dependency.status === 'down')
      .map(([name]) => name)
    tone = 'degraded'
    label = down.length > 0 ? `Unavailable: ${down.join(', ')}` : 'API degraded'
  }

  return (
    <span className={`status status--${tone}`} role="status">
      <span className="status__dot" aria-hidden="true" />
      {label}
    </span>
  )
}
