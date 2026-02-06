# Project insights agent

from collections import Counter
from data.marketplace_data import MARKETPLACE_CREDITS
from data.seller_profiles import SELLER_PROFILES
from utils.prompt_templates import INSIGHT_AGENT_SYSTEM
from utils.helpers import llm_chat
from utils.scoring import compute_trust_score


def build_insights() -> str:
    project_types = [c["project_type"] for c in MARKETPLACE_CREDITS]
    type_counts = Counter(project_types)

    seller_trust = []
    for seller_id, profile in SELLER_PROFILES.items():
        seller_trust.append((compute_trust_score(profile), seller_id, profile))
    seller_trust.sort(reverse=True)

    high_demand = sorted(MARKETPLACE_CREDITS, key=lambda c: c["demand_score"], reverse=True)[:3]

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
    prompt = (
        "User question: " + user_input + "\n\n" +
        "Project insights data:\n" + context + "\n\n" +
        "User profile context:\n" + session_context +
        "\n\nProvide concise insights grounded in the data."
    )
    return llm_chat(INSIGHT_AGENT_SYSTEM, prompt)
