check_input_prompt = """You are evaluating whether a startup description has enough substance to score for funding readiness.

Startup description: {description}
Stage: {stage}

Evaluate whether this input is too thin to score meaningfully. "Too thin" means: vague, generic, no real problem identified, or clearly underdeveloped (e.g. "I have an app idea", "I want to build a platform").

Return ONLY valid JSON with no markdown, no code fences:
{{
  "status": "too_thin",
  "checklist": ["item 1", "item 2"]
}}

OR if substantial enough:
{{
  "status": "ok",
  "checklist": []
}}

If status is "too_thin", checklist should have up to 5 items the founder needs to work through. If status is "ok", checklist must be an empty array."""

analyze_prompt = """You are an experienced accelerator reviewer. Evaluate this startup for funding readiness.

Startup description: {description}
Stage: {stage}
Traction: {traction}

Score across 5 dimensions: Problem (clarity, urgency), Solution (differentiation, specificity), Traction (evidence of demand), Market (size, timing), Team/Execution (signal from description).

OPPORTUNITIES — select the single best match based on stage and startup type:

1. Y Combinator: Strong team, clear problem, any traction, B2B/AI preferred, technical founders
2. Techstars: Team-first, coachable, sizable market, any stage, diversity-friendly
3. Tony Elumelu Foundation: Africa-based only, idea to 5yr old, social impact, job creation
4. Google for Startups Africa: Seed to Series A ONLY (Early Traction or Growing stage required), working product required, AI/technical depth required

Important: Google for Startups Africa should ONLY be selected if stage is "Early Traction" or "Growing".

Tone: honest mentor. Uncomfortable but actionable. Plain language, no jargon.

Return ONLY valid JSON with no markdown, no code fences:
{{
  "score": 64,
  "interpretation": "You're close — but not competitive yet.",
  "gaps": [
    {{"marker": "❌", "label": "Your traction is too weak", "explanation": "You don't have enough real users or proof that people want this yet."}},
    {{"marker": "⚠️", "label": "Your problem is a bit broad", "explanation": "It's not clear who urgently needs this."}},
    {{"marker": "✅", "label": "Your market is strong", "explanation": "This is a space with real demand."}}
  ],
  "coaching": [
    {{
      "headline": "Get your first 20–50 real users before applying",
      "explanation": "Accelerators want proof someone wants your product. Even manual outreach counts.",
      "example": "Direct outreach to 30 people in your target group is real traction."
    }}
  ],
  "opportunity": {{
    "name": "Y Combinator",
    "description": "Early-stage startup accelerator — equity-based",
    "match_score": 64,
    "match_interpretation": "You're close, but not competitive yet",
    "match_bullets": ["Your problem clarity is strong", "Your traction needs work before applying"],
    "deadline": "Applications open now"
  }}
}}

gaps must have exactly 3 items. coaching must have 2-3 items. match_bullets must have exactly 2 items."""

opportunity_coaching_prompt = """You are coaching a startup founder on how to improve specifically for {opportunity_name}.

Startup description: {description}
Stage: {stage}

What {opportunity_name} values:
{opportunity_criteria}

Return 2-3 specific, actionable steps tailored to what {opportunity_name} actually values.
Tone: sharp honest mentor. Not sales copy.

Return ONLY valid JSON with no markdown, no code fences:
{{
  "context": "What this opportunity values and why it matters for your startup...",
  "steps": [
    {{"action": "Do this specific thing", "explanation": "Here's why and how..."}},
    {{"action": "Do this other thing", "explanation": "Here's why and how..."}}
  ],
  "insight": "Optional insight line about what top applicants typically have."
}}

steps must have 2-3 items. insight is optional — include it only if genuinely useful."""
