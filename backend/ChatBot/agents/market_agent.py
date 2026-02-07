# Market analysis agent

from utils.data_store import get_credits, get_sellers
from utils.prompt_templates import MARKET_AGENT_SYSTEM
from utils.helpers import llm_chat
from utils.scoring import rank_credits


def market_summary() -> str:
    credits = get_credits()
    sellers = get_sellers()
    top_by_value = rank_credits(credits)[:3]
    top_selling = sorted(credits, key=lambda c: c["demand_score"], reverse=True)[:3]

    def credit_line(c):
        seller = sellers.get(c["seller_id"], {})
        return (
            f"{c['credit_id']} ({c['project_type']}) - $${c['price_usd']}, "
            f"demand {c['demand_score']}, offset {c['emissions_offset_tons']} tons, "
            f"seller {seller.get('name', c['seller_id'])}"
        )

    lines = ["Top value credits:"] + [credit_line(c) for c in top_by_value]
    lines += ["Top demand credits:"] + [credit_line(c) for c in top_selling]
    return "\n".join(lines)


def answer_market_question(user_input: str, session_context: str = "") -> str:
    context = market_summary()
    prompt = (
        "User question: " + user_input + "\n\n" +
        "Marketplace snapshot:\n" + context + "\n\n" +
        "User profile context:\n" + session_context +
        "\n\nAnswer in a clear, professional tone."
    )
    return llm_chat(MARKET_AGENT_SYSTEM, prompt)
