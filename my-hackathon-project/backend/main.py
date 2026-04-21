import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import anthropic

from models import (
    CheckInputRequest, CheckInputResponse,
    AnalyzeRequest, AnalyzeResponse,
    OpportunityCoachingRequest, OpportunityCoachingResponse,
)
from prompts import check_input_prompt, analyze_prompt, opportunity_coaching_prompt
from opportunities import OPPORTUNITIES

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
    allow_credentials=False,
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


def call_claude(prompt: str) -> dict:
    """Call Claude and parse JSON response. Raises ValueError on parse failure."""
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    text = message.content[0].text.strip()
    # Strip markdown code fences if present
    if text.startswith("```"):
        lines = text.split("\n")
        # Remove first and last lines (the fences)
        text = "\n".join(lines[1:-1])
    return json.loads(text)


@app.post("/check-input", response_model=CheckInputResponse)
async def check_input(request: CheckInputRequest):
    prompt = check_input_prompt.format(
        description=request.description,
        stage=request.stage,
    )
    for attempt in range(2):
        try:
            data = call_claude(prompt)
            return CheckInputResponse(**data)
        except (ValueError, KeyError, json.JSONDecodeError):
            if attempt == 1:
                raise HTTPException(status_code=422, detail="Failed to parse AI response")
    raise HTTPException(status_code=422, detail="Failed to parse AI response")


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    prompt = analyze_prompt.format(
        description=request.description,
        stage=request.stage,
        traction=request.traction or "None provided",
    )
    for attempt in range(2):
        try:
            data = call_claude(prompt)
            return AnalyzeResponse(**data)
        except (ValueError, KeyError, json.JSONDecodeError):
            if attempt == 1:
                raise HTTPException(status_code=422, detail="Failed to parse AI response")
    raise HTTPException(status_code=422, detail="Failed to parse AI response")


@app.post("/opportunity-coaching", response_model=OpportunityCoachingResponse)
async def opportunity_coaching(request: OpportunityCoachingRequest):
    opp = OPPORTUNITIES.get(request.opportunity_name)
    if not opp:
        raise HTTPException(status_code=404, detail=f"Opportunity '{request.opportunity_name}' not found")

    prompt = opportunity_coaching_prompt.format(
        opportunity_name=request.opportunity_name,
        description=request.description,
        stage=request.stage,
        opportunity_criteria=opp["criteria"],
    )
    for attempt in range(2):
        try:
            data = call_claude(prompt)
            return OpportunityCoachingResponse(**data)
        except (ValueError, KeyError, json.JSONDecodeError):
            if attempt == 1:
                raise HTTPException(status_code=422, detail="Failed to parse AI response")
    raise HTTPException(status_code=422, detail="Failed to parse AI response")
