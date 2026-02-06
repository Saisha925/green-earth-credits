# Router agent to classify user intent and route to the correct specialized agent

from utils.prompt_templates import ROUTER_SYSTEM_PROMPT
from utils.helpers import llm_chat, safe_parse_json, normalize_intent


def route_intent(user_input: str) -> str:
    # Ask LLM to classify intent
    response = llm_chat(ROUTER_SYSTEM_PROMPT, user_input)
    payload = safe_parse_json(response)
    label = payload.get("label", "general")
    normalized = normalize_intent(label)

    # Lightweight heuristic backup for robustness
    text = user_input.lower()
    if normalized == "general":
        if any(k in text for k in ["price", "demand", "selling", "market"]):
            return "market_analysis"
        if any(k in text for k in ["recommend", "buy", "best option", "suggest"]):
            return "recommendation"
        if any(k in text for k in ["emission", "offset", "co2", "impact"]):
            return "emissions"
        if any(k in text for k in ["explain", "what is", "theory", "sdg", "voluntary", "compliance"]):
            return "theory"
        if any(k in text for k in ["insight", "data", "project-specific", "trustworthy", "seller"]):
            return "insights"
    return normalized
