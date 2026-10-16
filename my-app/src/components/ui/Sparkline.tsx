export interface SparklineProps {
  values: readonly number[]
  ariaLabel: string
  className?: string
}

const WIDTH = 240
const HEIGHT = 64
const PADDING = 8

export function Sparkline({ values, ariaLabel, className }: SparklineProps) {
  if (values.length === 0) {
    return null
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const step = values.length > 1 ? (WIDTH - PADDING * 2) / (values.length - 1) : 0

  const points = values.map((value, index) => ({
    x: PADDING + index * step,
    y: PADDING + (1 - (value - min) / range) * (HEIGHT - PADDING * 2),
  }))

  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ')

  const lastPoint = points[points.length - 1]

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={ariaLabel}
      className={className}
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-pelan-600"
      />
      {lastPoint ? (
        <circle cx={lastPoint.x} cy={lastPoint.y} r={3.5} className="fill-clay-500" />
      ) : null}
    </svg>
  )
}
