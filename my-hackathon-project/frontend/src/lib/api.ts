import type { InputData, AnalysisResponse, CheckInputResponse, OpportunityDetailResponse } from '../types'

const API_BASE = import.meta.env.VITE_API_URL

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`)
  }
  return res.json() as Promise<T>
}

export function checkInput(data: Pick<InputData, 'description' | 'stage'>): Promise<CheckInputResponse> {
  return post<CheckInputResponse>('/check-input', data)
}

export function analyze(data: InputData): Promise<AnalysisResponse> {
  return post<AnalysisResponse>('/analyze', data)
}

export function getOpportunityCoaching(
  data: InputData & { opportunity_name: string }
): Promise<OpportunityDetailResponse> {
  return post<OpportunityDetailResponse>('/opportunity-coaching', data)
}
