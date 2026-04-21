from pydantic import BaseModel
from typing import Optional


class CheckInputRequest(BaseModel):
    description: str
    stage: str  # "Idea" | "MVP" | "Early Traction" | "Growing"


class CheckInputResponse(BaseModel):
    status: str  # "too_thin" | "ok"
    checklist: list[str] = []


class AnalyzeRequest(BaseModel):
    description: str
    stage: str
    traction: Optional[str] = None


class GapItem(BaseModel):
    marker: str        # "❌" | "⚠️" | "✅"
    label: str
    explanation: str


class CoachingItem(BaseModel):
    headline: str
    explanation: str
    example: Optional[str] = None


class OpportunityResult(BaseModel):
    name: str
    description: str
    match_score: int
    match_interpretation: str
    match_bullets: list[str]  # exactly 2 items
    deadline: str


class AnalyzeResponse(BaseModel):
    score: int
    interpretation: str
    gaps: list[GapItem]       # exactly 3 items
    coaching: list[CoachingItem]  # 2-3 items
    opportunity: OpportunityResult


class OpportunityCoachingRequest(BaseModel):
    description: str
    stage: str
    opportunity_name: str


class CoachingStep(BaseModel):
    action: str
    explanation: str


class OpportunityCoachingResponse(BaseModel):
    context: str
    steps: list[CoachingStep]  # 2-3 items
    insight: Optional[str] = None
