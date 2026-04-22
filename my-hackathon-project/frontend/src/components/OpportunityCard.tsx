import type { OpportunityResult } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface OpportunityCardProps {
  opportunity: OpportunityResult
  onImprove: (opportunityName: string) => void
}

export default function OpportunityCard({ opportunity, onImprove }: OpportunityCardProps) {
  return (
    <div className="py-4 space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Best match for you
      </h2>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground">{opportunity.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{opportunity.description}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-foreground">{opportunity.match_score}%</div>
              <div className="text-xs text-muted-foreground">match</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{opportunity.match_interpretation}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-1">
            {opportunity.match_bullets.map((bullet, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5">•</span>
                {bullet}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">📅 {opportunity.deadline}</p>
          <p className="text-xs text-muted-foreground/60 italic">
            We picked this based on your current stage and focus.
          </p>
          <Button className="w-full" onClick={() => onImprove(opportunity.name)}>
            See how to improve for this
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
