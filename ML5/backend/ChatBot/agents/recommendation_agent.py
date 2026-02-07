# Recommendation agent

from utils.data_store import get_credits, get_sellers, get_users, get_user_footprint, format_footprint_for_chat
from utils.prompt_templates import RECOMMENDATION_AGENT_SYSTEM
from utils.helpers import llm_chat
from utils.scoring import compute_trust_score


def extract_user_id_from_context(session_context: str) -> str:
    """Extract user_id from session context if available."""
    lines = session_context.split("\n")
    for line in lines:
        if "user_id:" in line.lower():
            return line.split(":", 1)[-1].strip()
    return None


def detect_user_profile(user_input: str) -> str:
    text = user_input.lower()
    if any(k in text for k in ["corporate", "enterprise", "company"]):
        return "corporate_buyer"
    if any(k in text for k in ["startup", "small business"]):
        return "startup"
    if any(k in text for k in ["individual", "personal", "myself"]):
        return "individual"
    if any(k in text for k in ["ngo", "nonprofit", "foundation"]):
        return "ngo"
    return "startup"


def build_recommendations(profile_key: str):
    users = get_users()
    credits = get_credits()
    sellers = get_sellers()
    profile = users[profile_key]
    recs = []
    for credit in credits:
        seller = sellers.get(credit["seller_id"], {})
        trust = compute_trust_score(seller)
        # Score: demand + trust + impact per dollar
        price = max(credit["price_usd"], 1.0)
        impact_per_dollar = credit["emissions_offset_tons"] / price
        score = (0.4 * credit["demand_score"]) + (0.35 * trust) + (0.25 * impact_per_dollar)
        recs.append((score, credit, seller))

    recs.sort(key=lambda x: x[0], reverse=True)
    return profile, recs[:3]


def answer_recommendation_question(user_input: str, session_context: str = "") -> str:
    profile_key = detect_user_profile(user_input)
    profile, top_recs = build_recommendations(profile_key)

    lines = [
        f"Detected profile: {profile['label']} (priority: {profile['priority']}, budget ~${profile['budget_usd']})",
        "Top recommendations:",
    ]
    for score, credit, seller in top_recs:
        lines.append(
            f"- {credit['credit_id']} ({credit['project_type']}) at ${credit['price_usd']} | "
            f"demand {credit['demand_score']} | offset {credit['emissions_offset_tons']} tons | "
            f"seller {seller.get('name', credit['seller_id'])} (trust {seller.get('trust_score', 'N/A')})"
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
        "Recommendation context:\n" + "\n".join(lines) + "\n" +
        user_footprint_context +
        "User profile context:\n" + session_context +
        "\n\nAnswer with 2-3 concise recommendations and why they fit the user. Consider their actual carbon footprint if available."
    )
    return llm_chat(RECOMMENDATION_AGENT_SYSTEM, prompt)
