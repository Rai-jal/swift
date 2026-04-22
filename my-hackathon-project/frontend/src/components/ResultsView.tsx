import type { AnalysisResponse, OpportunityDetailResponse } from '../types'
import ReadinessScore from './ReadinessScore'
import GapBreakdown from './GapBreakdown'
import CoachingSection from './CoachingSection'
import OpportunityCard from './OpportunityCard'
import OpportunityModal from './OpportunityModal'

interface ResultsViewProps {
  result: AnalysisResponse
  modalOpen: boolean
  opportunityDetail: OpportunityDetailResponse | null
  onModalOpen: (opportunityName: string) => void
  onModalClose: () => void
}

export default function ResultsView({ result, onModalOpen, onModalClose, modalOpen, opportunityDetail }: ResultsViewProps) {
  return (
    <div className="w-full space-y-2 pb-12">
      <ReadinessScore score={result.score} interpretation={result.interpretation} />
      <div className="border-t border-border" />
      <GapBreakdown gaps={result.gaps} />
      <div className="border-t border-border" />
      <CoachingSection coaching={result.coaching} />
      <div className="border-t border-border" />
      <OpportunityCard
        opportunity={result.opportunity}
        onImprove={onModalOpen}
      />
      <OpportunityModal
        open={modalOpen}
        opportunityName={result.opportunity.name}
        detail={opportunityDetail}
        onClose={onModalClose}
      />
    </div>
  )
}
