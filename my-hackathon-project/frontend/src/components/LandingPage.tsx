import type { AppState } from '../App'
import type { InputData, AnalysisResponse, OpportunityDetailResponse } from '../types'
import InputCard from './InputCard'
import GhostedScores from './GhostedScores'

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
  onSubmit,
  onRetry,
  onEditInput,
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

        {appState === 'loading' && (
          <div className="text-center text-muted-foreground text-sm py-8">
            LoadingAnimation coming in step 7
          </div>
        )}
        {appState === 'pre-check' && (
          <div className="text-center text-muted-foreground text-sm py-8">
            PreCheckList coming in step 7
          </div>
        )}
        {appState === 'results' && (
          <div className="text-center text-muted-foreground text-sm py-8">
            Results coming in step 8
          </div>
        )}
        {appState === 'error' && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              We couldn't complete your analysis this time. This might be a temporary issue — let's try again.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={onRetry} className="text-sm underline">Try again</button>
              <button onClick={onEditInput} className="text-sm underline">Edit my input</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
