import type { GapItem } from '../types'

interface GapBreakdownProps {
  gaps: GapItem[]
}

export default function GapBreakdown({ gaps }: GapBreakdownProps) {
  return (
    <div className="space-y-3 py-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Where you stand
      </h2>
      <div className="space-y-2">
        {gaps.map((gap, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/40"
          >
            <span className="text-lg leading-none mt-0.5">{gap.marker}</span>
            <div>
              <p className="text-sm font-medium text-foreground">{gap.label}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{gap.explanation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
