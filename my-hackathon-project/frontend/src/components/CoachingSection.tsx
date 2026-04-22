import type { CoachingItem } from '../types'

interface CoachingSectionProps {
  coaching: CoachingItem[]
}

export default function CoachingSection({ coaching }: CoachingSectionProps) {
  return (
    <div className="space-y-3 py-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        How to improve
      </h2>
      <div className="space-y-4">
        {coaching.map((item, i) => (
          <div key={i} className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{item.headline}</p>
            <p className="text-sm text-muted-foreground">{item.explanation}</p>
            {item.example && (
              <p className="text-xs text-muted-foreground/70 italic">{item.example}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
