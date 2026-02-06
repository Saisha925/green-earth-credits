import os

from flask import Flask, jsonify, request

from agents.router_agent import route_intent
from agents.market_agent import answer_market_question
from agents.recommendation_agent import answer_recommendation_question, detect_user_profile
from agents.emission_agent import answer_emission_question
from agents.theory_agent import answer_theory_question
from agents.insight_agent import answer_insight_question
from data.marketplace_data import MARKETPLACE_CREDITS
from data.seller_profiles import SELLER_PROFILES
from data.user_profiles import USER_PROFILES
from data.theory_knowledge import THEORY_KNOWLEDGE
from utils.helpers import get_groq_client

app = Flask(__name__)


def validate_groq():
    try:
        get_groq_client()
        return None
    except Exception as exc:
        return str(exc)


@app.route("/health", methods=["GET"])
def health():
    error = validate_groq()
    status = "ok" if error is None else "error"
    return jsonify({"status": status, "groq": error or "ready"})


@app.route("/options", methods=["GET"])
def options():
    return jsonify(
        {
            "options": [
                {
                    "id": 1,
                    "label": "Market analysis",
                    "description": "Compare carbon credits by price, demand, and market performance.",
                    "intent": "market_analysis",
                },
                {
                    "id": 2,
                    "label": "Recommendations",
                    "description": "Get the best credits to buy based on your buyer type and goals.",
                    "intent": "recommendation",
                },
                {
                    "id": 3,
                    "label": "Emissions impact",
                    "description": "Estimate emissions offsets and climate impact calculations.",
                    "intent": "emissions",
                },
                {
                    "id": 4,
                    "label": "Theory & insights",
                    "description": "Ask carbon market concepts or project insight questions.",
                    "intent": "theory",
                },
            ]
        }
    )


@app.route("/profiles", methods=["GET"])
def profiles():
    return jsonify({"profiles": USER_PROFILES})


@app.route("/route", methods=["POST"])
def route_only():
    payload = request.get_json(silent=True) or {}
    message = (payload.get("message") or "").strip()
    if not message:
        return jsonify({"error": "message is required"}), 400

    intent = route_intent(message)
    return jsonify({"intent": intent})


@app.route("/chat", methods=["POST"])
def chat():
    payload = request.get_json(silent=True) or {}
    message = (payload.get("message") or "").strip()
    profile = (payload.get("profile") or "").strip().lower()

    if not message:
        return jsonify({"error": "message is required"}), 400

    error = validate_groq()
    if error is not None:
        return jsonify({"error": "GROQ_API_KEY not configured", "details": error}), 500

    intent = route_intent(message)

    # Allow explicit profile override for recommendations
    if intent == "recommendation":
        if profile and profile in USER_PROFILES:
            user_hint = f"User profile: {USER_PROFILES[profile]['label']}\n"
            response = answer_recommendation_question(user_hint + message)
        else:
            response = answer_recommendation_question(message)
    elif intent == "market_analysis":
        response = answer_market_question(message)
    elif intent == "emissions":
        response = answer_emission_question(message)
    elif intent == "theory":
        response = answer_theory_question(message)
    elif intent == "insights":
        response = answer_insight_question(message)
    else:
        response = answer_market_question(message)

    return jsonify({"intent": intent, "response": response})


@app.route("/data/marketplace", methods=["GET"])
def marketplace_data():
    return jsonify({"marketplace": MARKETPLACE_CREDITS})


@app.route("/data/sellers", methods=["GET"])
def sellers_data():
    return jsonify({"sellers": SELLER_PROFILES})


@app.route("/data/theory", methods=["GET"])
def theory_data():
    return jsonify({"theory": THEORY_KNOWLEDGE})


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(host="127.0.0.1", port=port, debug=False)
