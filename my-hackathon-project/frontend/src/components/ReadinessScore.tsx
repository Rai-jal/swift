interface ReadinessScoreProps {
  score: number
  interpretation: string
}

export default function ReadinessScore({ score, interpretation }: ReadinessScoreProps) {
  return (
    <div className="text-center py-8 space-y-2">
      <div className="text-6xl font-bold text-foreground">
        {score}%
      </div>
      <div className="text-sm font-medium text-foreground/70 uppercase tracking-widest">
        Your Funding Readiness
      </div>
      <p className="text-lg text-foreground mt-2">{interpretation}</p>
      <p className="text-xs text-muted-foreground">
        Based on what top accelerators typically look for.
      </p>
    </div>
  )
}
