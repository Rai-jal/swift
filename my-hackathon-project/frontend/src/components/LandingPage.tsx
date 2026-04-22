import type { AppState } from '../App'
import type { InputData, AnalysisResponse, OpportunityDetailResponse } from '../types'
import InputCard from './InputCard'
import GhostedScores from './GhostedScores'
import LoadingAnimation from './LoadingAnimation'
import PreCheckList from './PreCheckList'
import ErrorState from './ErrorState'
import ResultsView from './ResultsView'

interface LandingPageProps {
  appState: AppState
  inputData: InputData | null
  analysisResult: AnalysisResponse | null
  preCheckData: string[] | null
  modalOpen: boolean
  opportunityDetail: OpportunityDetailResponse | null
  onSubmit: (data: InputData) => void
  onRetry: () => void
  onEditInput: () => void
  onModalOpen: (opportunityName: string) => void
  onModalClose: () => void
}

export default function LandingPage({
  appState,
  analysisResult,
  preCheckData,
  modalOpen,
  opportunityDetail,
  onSubmit,
  onRetry,
  onEditInput,
  onModalOpen,
  onModalClose,
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          What are your chances of getting funded?
        </h1>
        <p className="text-muted-foreground text-base">
          Get a brutally honest breakdown of your startup — and how to improve it
        </p>
      </div>

      <div className="w-full max-w-2xl relative">
        {appState === 'input' && <GhostedScores />}

        {appState === 'input' && <InputCard onSubmit={onSubmit} />}

        {appState === 'loading' && <LoadingAnimation />}
        {appState === 'pre-check' && (
          <PreCheckList checklist={preCheckData ?? undefined} onEdit={onEditInput} />
        )}
        {appState === 'results' && analysisResult && (
          <ResultsView
            result={analysisResult}
            modalOpen={modalOpen}
            opportunityDetail={opportunityDetail}
            onModalOpen={onModalOpen}
            onModalClose={onModalClose}
          />
        )}
        {appState === 'error' && <ErrorState onRetry={onRetry} onEdit={onEditInput} />}
      </div>
    </div>
  )
}
