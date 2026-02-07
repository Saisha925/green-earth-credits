# Project insights agent

from collections import Counter
from utils.data_store import get_credits, get_sellers, get_user_footprint, format_footprint_for_chat
from utils.prompt_templates import INSIGHT_AGENT_SYSTEM
from utils.helpers import llm_chat
from utils.scoring import compute_trust_score


def extract_user_id_from_context(session_context: str) -> str:
    """Extract user_id from session context if available."""
    lines = session_context.split("\n")
    for line in lines:
        if "user_id:" in line.lower():
            return line.split(":", 1)[-1].strip()
    return None


def build_insights() -> str:
    credits = get_credits()
    sellers = get_sellers()
    project_types = [c["project_type"] for c in credits]
    type_counts = Counter(project_types)

    seller_trust = []
    for seller_id, profile in sellers.items():
        seller_trust.append((compute_trust_score(profile), seller_id, profile))
    seller_trust.sort(reverse=True)

    high_demand = sorted(credits, key=lambda c: c["demand_score"], reverse=True)[:3]

    lines = ["Project type distribution:"]
    for ptype, count in type_counts.items():
        lines.append(f"- {ptype}: {count} listings")

    lines.append("Top trusted sellers:")
    for score, seller_id, profile in seller_trust[:3]:
        lines.append(f"- {profile['name']} (trust score {profile['trust_score']}, volume {profile['past_sales_volume']})")

    lines.append("High demand credits:")
    for credit in high_demand:
        lines.append(
            f"- {credit['credit_id']} ({credit['project_type']}) demand {credit['demand_score']} at ${credit['price_usd']}"
        )

    return "\n".join(lines)


def answer_insight_question(user_input: str, session_context: str = "") -> str:
    context = build_insights()
    
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
        "Project insights data:\n" + context + "\n" +
        user_footprint_context +
        "User profile context:\n" + session_context +
        "\n\nProvide concise insights grounded in the data. Consider the user's carbon footprint if available."
    )
    return llm_chat(INSIGHT_AGENT_SYSTEM, prompt)
