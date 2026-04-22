import { useState } from 'react'
import type { InputData, AnalysisResponse, CheckInputResponse, OpportunityDetailResponse } from './types'
import { checkInput, analyze, getOpportunityCoaching } from './lib/api'
import LandingPage from './components/LandingPage'

export type AppState = 'input' | 'loading' | 'pre-check' | 'results' | 'error'

export default function App() {
  const [appState, setAppState] = useState<AppState>('input')
  const [inputData, setInputData] = useState<InputData | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [preCheckData, setPreCheckData] = useState<string[] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [opportunityDetail, setOpportunityDetail] = useState<OpportunityDetailResponse | null>(null)
  const [, setErrorRetryCount] = useState(0)

  async function handleSubmit(data: InputData) {
    setInputData(data)
    setErrorRetryCount(0)

    try {
      const checkResult: CheckInputResponse = await checkInput({
        description: data.description,
        stage: data.stage,
      })

      if (checkResult.status === 'too_thin') {
        setPreCheckData(checkResult.checklist ?? [])
        setAppState('pre-check')
        return
      }

      setAppState('loading')
      await runAnalyze(data)
    } catch {
      setAppState('error')
    }
  }

  async function runAnalyze(data: InputData, retryCount = 0) {
    try {
      const result = await analyze(data)
      setAnalysisResult(result)
      setAppState('results')
    } catch {
      if (retryCount < 2) {
        await runAnalyze(data, retryCount + 1)
      } else {
        setErrorRetryCount(retryCount)
        setAppState('error')
      }
    }
  }

  async function handleRetry() {
    if (!inputData) return
    setAppState('loading')
    await runAnalyze(inputData)
  }

  function handleEditInput() {
    setAppState('input')
  }

  async function handleModalOpen(opportunityName: string) {
    if (!inputData) return
    try {
      const detail = await getOpportunityCoaching({
        ...inputData,
        opportunity_name: opportunityName,
      })
      setOpportunityDetail(detail)
      setModalOpen(true)
    } catch {
      // silently fail — modal just won't open
    }
  }

  function handleModalClose() {
    setModalOpen(false)
  }

  return (
    <LandingPage
      appState={appState}
      inputData={inputData}
      analysisResult={analysisResult}
      preCheckData={preCheckData}
      modalOpen={modalOpen}
      opportunityDetail={opportunityDetail}
      onSubmit={handleSubmit}
      onRetry={handleRetry}
      onEditInput={handleEditInput}
      onModalOpen={handleModalOpen}
      onModalClose={handleModalClose}
    />
  )
}
