# Shared helper functions for the chatbot

import json
from typing import Dict, Any

from groq import Groq

from config import GROQ_API_KEY, MODEL_NAME, TEMPERATURE, MAX_TOKENS


def get_groq_client() -> Groq:
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set in the environment.")
    return Groq(api_key=GROQ_API_KEY)


def llm_chat(system_prompt: str, user_prompt: str, temperature: float = TEMPERATURE, max_tokens: int = MAX_TOKENS) -> str:
    client = get_groq_client()
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        temperature=temperature,
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )
    return response.choices[0].message.content.strip()


def safe_parse_json(text: str) -> Dict[str, Any]:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Best-effort fallback if model returns extra text
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1:
            try:
                return json.loads(text[start : end + 1])
            except json.JSONDecodeError:
                return {}
        return {}


def normalize_intent(label: str) -> str:
    label = (label or "").lower().strip()
    if label in {"market", "market_analysis", "marketplace"}:
        return "market_analysis"
    if label in {"recommend", "recommendation"}:
        return "recommendation"
    if label in {"emission", "emissions", "impact"}:
        return "emissions"
    if label in {"theory", "explain"}:
        return "theory"
    if label in {"insight", "insights", "data"}:
        return "insights"
    return "general"
