export interface InputData {
  description: string
  stage: "Idea" | "MVP" | "Early Traction" | "Growing"
  traction?: string
}

export interface GapItem {
  marker: "❌" | "⚠️" | "✅"
  label: string
  explanation: string
}

export interface CoachingItem {
  headline: string
  explanation: string
  example?: string
}

export interface OpportunityResult {
  name: string
  description: string
  match_score: number
  match_interpretation: string
  match_bullets: [string, string]
  deadline: string
}

export interface AnalysisResponse {
  score: number
  interpretation: string
  gaps: [GapItem, GapItem, GapItem]
  coaching: CoachingItem[]
  opportunity: OpportunityResult
}

export interface CheckInputResponse {
  status: "too_thin" | "ok"
  checklist?: string[]
}

export interface OpportunityDetailResponse {
  context: string
  steps: Array<{ action: string; explanation: string }>
  insight?: string
}
