import type { OpportunityDetailResponse } from '../types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface OpportunityModalProps {
  open: boolean
  opportunityName: string
  detail: OpportunityDetailResponse | null
  onClose: () => void
}

export default function OpportunityModal({ open, opportunityName, detail, onClose }: OpportunityModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>How to improve for {opportunityName}</DialogTitle>
        </DialogHeader>
        {detail ? (
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">{detail.context}</p>
            <div className="space-y-3">
              {detail.steps.map((step, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{step.action}</p>
                  <p className="text-sm text-muted-foreground">{step.explanation}</p>
                </div>
              ))}
            </div>
            {detail.insight && (
              <p className="text-xs text-muted-foreground/70 italic border-t pt-3">
                {detail.insight}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">Loading coaching…</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
