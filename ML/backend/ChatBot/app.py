import sys

from agents.router_agent import route_intent
from agents.market_agent import answer_market_question
from agents.recommendation_agent import answer_recommendation_question
from agents.emission_agent import answer_emission_question
from agents.theory_agent import answer_theory_question
from agents.insight_agent import answer_insight_question
from utils.helpers import get_groq_client

WELCOME = """
Hi! I'm your Carbon Market AI assistant. I can help you analyze carbon credits, explain concepts,
run impact calculations, and recommend the best options based on marketplace data.

Choose one of the options below, or type your question directly:
1. Compare carbon credits and market performance (pricing + demand)
2. Get recommendations on which credits to buy
3. Understand emissions and climate impact (offset calculations)
4. Explore best-selling credits in the market
5. Get personalized suggestions (based on your buyer type)
6. Ask theory or concept questions (carbon markets, SDG 13, etc.)
7. Ask data or insight questions from this project
8. Ask general marketplace questions
9. Free-form chat
Type 'exit' to quit.
""".strip()


PRESET_QUERIES = {
    "1": "Compare credits and market performance using price and demand.",
    "2": "What credits should I buy and why?",
    "3": "How much emissions would this project offset?",
    "4": "What is selling best right now?",
    "5": "I am a corporate buyer. What should I purchase?",
    "6": "Explain carbon credits and SDG 13.",
    "7": "Give insights based on the data in this project.",
    "8": "What sellers are most trustworthy?",
    "9": "Tell me something useful about the carbon credit marketplace.",
}


def handle_query(user_input: str) -> str:
    intent = route_intent(user_input)
    if intent == "market_analysis":
        return answer_market_question(user_input)
    if intent == "recommendation":
        return answer_recommendation_question(user_input)
    if intent == "emissions":
        return answer_emission_question(user_input)
    if intent == "theory":
        return answer_theory_question(user_input)
    if intent == "insights":
        return answer_insight_question(user_input)
    # Fallback: treat general as market + recommendation blend
    return answer_market_question(user_input)


def main():
    try:
        # Validate Groq client early for clear errors
        get_groq_client()
    except Exception as exc:
        print(f"Configuration error: {exc}")
        print("Set GROQ_API_KEY in your environment before running.")
        sys.exit(1)

    print(WELCOME)

    while True:
        user_input = input("\nYou: ").strip()
        if not user_input:
            continue
        if user_input.lower() in {"exit", "quit"}:
            print("Goodbye! If you want to explore more, just run the chatbot again.")
            break

        if user_input in PRESET_QUERIES:
            user_input = PRESET_QUERIES[user_input]

        try:
            response = handle_query(user_input)
            print("\nAssistant:\n" + response)
        except Exception as exc:
            print("\nAssistant:\nSorry, I ran into an error.")
            print(f"Details: {exc}")


if __name__ == "__main__":
    main()
