# Emissions impact agent

import re
import json
from utils.data_store import get_credits, get_user_footprint, format_footprint_for_chat
from utils.prompt_templates import EMISSION_AGENT_SYSTEM
from utils.helpers import llm_chat


def find_credit_by_id(credit_id: str):
    for credit in get_credits():
        if credit["credit_id"].lower() == credit_id.lower():
            return credit
    return None


def extract_quantity(text: str) -> int:
    match = re.search(r"(\d+)\s*(credits|credit|tons|ton)", text.lower())
    if match:
        return int(match.group(1))
    return 1


def extract_user_id_from_context(session_context: str) -> str:
    """Extract user_id from session context if available."""
    lines = session_context.split("\n")
    for line in lines:
        if "user_id:" in line.lower():
            return line.split(":", 1)[-1].strip()
    return None


def answer_emission_question(user_input: str, session_context: str = "") -> str:
    quantity = extract_quantity(user_input)
    credit = None
    credits = get_credits()
    
    # Try to find credit by ID in user input
    for c in credits:
        if c["credit_id"].lower() in user_input.lower():
            credit = c
            break

    if not credit:
        # Default to highest impact credit for illustration
        credit = max(credits, key=lambda c: c["emissions_offset_tons"])

    total_offset = credit["emissions_offset_tons"] * quantity

    context = (
        f"Selected credit: {credit['credit_id']} ({credit['project_type']})\n"
        f"Offset per credit: {credit['emissions_offset_tons']} tons CO2\n"
        f"Quantity: {quantity}\n"
        f"Estimated total offset: {total_offset} tons CO2"
    )

    # Try to include user's carbon footprint if available
    user_footprint_context = ""
    user_id = extract_user_id_from_context(session_context)
    if user_id:
        try:
            user_footprint = get_user_footprint(user_id)
            if user_footprint:
                footprint_text = format_footprint_for_chat(user_footprint)
                user_footprint_context = f"\nUser's Carbon Footprint:\n{footprint_text}\n"
        except Exception as e:
            print(f"Warning: Could not retrieve user footprint: {str(e)}")

    prompt = (
        "User question: " + user_input + "\n\n" +
        "Emissions context:\n" + context + "\n" +
        user_footprint_context +
        "User profile context:\n" + session_context +
        "\n\nExplain the calculation in plain language, considering the user's carbon footprint, and note assumptions."
    )
    return llm_chat(EMISSION_AGENT_SYSTEM, prompt)
