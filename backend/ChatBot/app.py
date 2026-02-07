import sys

from agents.router_agent import route_intent
from agents.market_agent import answer_market_question
from agents.recommendation_agent import answer_recommendation_question
from agents.emission_agent import answer_emission_question
from agents.theory_agent import answer_theory_question
from agents.insight_agent import answer_insight_question
from utils.helpers import get_groq_client
from utils.db import seed_if_empty
from utils.data_store import get_session_profile

DATA_MISSING_MODE = False

ROLE_QUESTION = "Before we begin, are you here as a Buyer or a Seller?"

FEATURE_MENU = """
Here are four core features I can help with:
1) Retire Credits: Permanently retire credits to document your climate action and keep records clean.
2) Certificate Authentication: Validate a credit certificate before listing or purchasing.
3) Carbon Footprint Calculator: Estimate emissions for planning and offset decisions.
4) ESG Report Generator: Create a business-friendly ESG report with key sustainability insights.
You can choose a number or just describe what you want in your own words.
""".strip()

FEATURE_LINKS = {
    "retire_credits": "/retire-credits",
    "certificate_auth": "/certificate-auth",
    "carbon_footprint": "/carbon-footprint",
    "esg_report": "/esg-report",
}

FEATURE_ALIASES = {
    "1": "retire_credits",
    "2": "certificate_auth",
    "3": "carbon_footprint",
    "4": "esg_report",
}

FEATURE_KEYWORDS = {
    "retire_credits": ["retire", "retirement", "offset", "offsetting", "offset emissions"],
    "certificate_auth": ["certificate", "authenticate", "verification", "verify", "validate"],
    "carbon_footprint": ["footprint", "calculate emissions", "emissions calculator", "carbon calculator"],
    "esg_report": ["esg", "report", "sustainability report", "esg reporting"],
}


def detect_feature_intent(user_input: str):
    text = user_input.lower().strip()
    if text in FEATURE_ALIASES:
        return FEATURE_ALIASES[text]
    for feature_key, keywords in FEATURE_KEYWORDS.items():
        if any(k in text for k in keywords):
            return feature_key
    return None


def feature_response(feature_key: str) -> str:
    if feature_key == "retire_credits":
        confirm = "Great, retiring credits is the right step for formalizing climate action."
        short = "I can guide you through choosing quantities, beneficiaries, and retirement records."
    elif feature_key == "certificate_auth":
        confirm = "Got it, certificate authentication helps ensure credibility before buying or listing."
        short = "I can help verify the certificate details and expected standards."
    elif feature_key == "carbon_footprint":
        confirm = "Understood, a footprint calculation will clarify your emissions baseline."
        short = "I can estimate emissions and suggest next actions based on your profile."
    else:
        confirm = "Sounds good, an ESG report will help summarize your sustainability position."
        short = "I can prepare the report inputs and highlight material insights."

    return "\n".join(
        [
            confirm,
            short,
            f"Mock link: {FEATURE_LINKS[feature_key]}",
        ]
    )


def is_exit_message(user_input: str) -> bool:
    text = user_input.strip().lower()
    return text in {"exit", "quit", "bye", "no", "nope", "nothing else", "that's all", "that is all"}


def is_thanks_message(user_input: str) -> bool:
    text = user_input.strip().lower()
    return any(k in text for k in ["thanks", "thank you", "appreciate it", "thx"])


def derive_buyer_state(profile: dict) -> str:
    has_retired = profile.get("credits_retired", 0) > 0
    has_target = bool(profile.get("net_zero_target_year"))
    annual_emissions = profile.get("annual_emissions", 0)

    if has_retired and has_target and annual_emissions >= 3000:
        return (
            "You have a clear net-zero target and have already retired credits, "
            "but your emissions scale suggests you will benefit from consistent, high-quality offsets."
        )
    if has_retired and has_target:
        return (
            "You have a net-zero target and prior retirements, which puts you in a strong position "
            "to optimize for quality and verification."
        )
    if has_target:
        return (
            "You have a net-zero target in place, so the next step is aligning purchases to credible "
            "credits and measurable impact."
        )
    return (
        "You are early in your offset journey, so establishing a baseline and selecting verified credits "
        "will provide the most value."
    )


def build_session_context(role: str, profile: dict) -> str:
    if role == "buyer":
        buyer_state = derive_buyer_state(profile)
        return (
            "User role: Buyer\n"
            f"Company: {profile.get('company')} in {profile.get('industry')} based in {profile.get('location')}.\n"
            f"ESG maturity: {profile.get('esg_maturity')}.\n"
            f"Buyer state: {buyer_state}\n"
            "Personalization guidance: Reference marketplace quality, seller trust, and credit availability. "
            "Keep the tone advisory and business-friendly."
        )

    return (
        "User role: Seller\n"
        f"Organization: {profile.get('organization')} with {profile.get('project_type')} projects.\n"
        f"Verification standard: {profile.get('verification_standard')}. "
        f"Trust score: {profile.get('trust_score')}.\n"
        f"Market demand: {profile.get('market_demand')}.\n"
        "Personalization guidance: Reference buyer demand, emissions trends, and offset potential. "
        "Keep the tone advisory and business-friendly."
    )


def load_profile_for_role(role: str) -> dict:
    profile = get_session_profile(role)
    return dict(profile)


def has_missing_profile_data(profile: dict) -> bool:
    required_fields = ["role"]
    return any(profile.get(field) in {None, ""} for field in required_fields)


def handle_query(user_input: str, session_context: str) -> str:
    intent = route_intent(user_input)
    if intent == "market_analysis":
        return answer_market_question(user_input, session_context)
    if intent == "recommendation":
        return answer_recommendation_question(user_input, session_context)
    if intent == "emissions":
        return answer_emission_question(user_input, session_context)
    if intent == "theory":
        return answer_theory_question(user_input, session_context)
    if intent == "insights":
        return answer_insight_question(user_input, session_context)
    # Fallback: treat general as market + recommendation blend
    return answer_market_question(user_input, session_context)


def prompt_for_role() -> str:
    while True:
        user_input = input(f"{ROLE_QUESTION} ").strip().lower()
        if user_input in {"buyer", "b"}:
            return "buyer"
        if user_input in {"seller", "s"}:
            return "seller"
        print("Please respond with Buyer or Seller to continue.")


def main():
    try:
        # Validate Groq client early for clear errors
        get_groq_client()
        seed_if_empty()
    except Exception as exc:
        print(f"Configuration error: {exc}")
        print("Set GROQ_API_KEY and MONGODB_URI in your environment before running.")
        sys.exit(1)

    role = prompt_for_role()
    profile = load_profile_for_role(role)

    if DATA_MISSING_MODE and has_missing_profile_data(profile):
        print(
            "Some profile data appears missing. I can still help with general guidance or "
            "guide you to generate the missing data."
        )

    session_context = build_session_context(role, profile)
    print(FEATURE_MENU)

    while True:
        user_input = input("\nYou: ").strip()
        if not user_input:
            continue

        if is_exit_message(user_input) or is_thanks_message(user_input):
            print(
                "Sounds good. If you need help with credits, ESG, or sustainability insights later, "
                "I will be here."
            )
            break

        feature_key = detect_feature_intent(user_input)
        if feature_key:
            print("\nAssistant:\n" + feature_response(feature_key))
            continue

        try:
            response = handle_query(user_input, session_context)
            print("\nAssistant:\n" + response)
        except Exception as exc:
            print("\nAssistant:\nSorry, I ran into an error.")
            print(f"Details: {exc}")


if __name__ == "__main__":
    main()
