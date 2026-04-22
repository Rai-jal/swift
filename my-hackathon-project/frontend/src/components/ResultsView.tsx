import type { AnalysisResponse, OpportunityDetailResponse } from '../types'
import ReadinessScore from './ReadinessScore'
import GapBreakdown from './GapBreakdown'
import CoachingSection from './CoachingSection'

interface ResultsViewProps {
  result: AnalysisResponse
  modalOpen: boolean
  opportunityDetail: OpportunityDetailResponse | null
  onModalOpen: (opportunityName: string) => void
  onModalClose: () => void
}

export default function ResultsView({ result, onModalOpen: _onModalOpen, onModalClose: _onModalClose, modalOpen: _modalOpen, opportunityDetail: _opportunityDetail }: ResultsViewProps) {
  return (
    <div className="w-full space-y-2 pb-12">
      <ReadinessScore score={result.score} interpretation={result.interpretation} />
      <div className="border-t border-border" />
      <GapBreakdown gaps={result.gaps} />
      <div className="border-t border-border" />
      <CoachingSection coaching={result.coaching} />
      <div className="border-t border-border" />
      {/* OpportunityCard goes here in step 9 — placeholder for now */}
      <div className="py-4 text-center text-sm text-muted-foreground">
        OpportunityCard coming in step 9
      </div>
    </div>
  )
}
