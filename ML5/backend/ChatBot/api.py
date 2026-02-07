import os

from flask import Flask, jsonify, request

from agents.router_agent import route_intent
from agents.market_agent import answer_market_question
from agents.recommendation_agent import answer_recommendation_question
from agents.emission_agent import answer_emission_question
from agents.theory_agent import answer_theory_question
from agents.insight_agent import answer_insight_question
from utils.data_store import get_credits, get_sellers, get_users, get_theory
from utils.helpers import get_groq_client
from utils.db import seed_if_empty

app = Flask(__name__)


def validate_dependencies():
    try:
        get_groq_client()
        seed_if_empty()
        return None
    except Exception as exc:
        return str(exc)


@app.route("/health", methods=["GET"])
def health():
    error = validate_dependencies()
    status = "ok" if error is None else "error"
    return jsonify({"status": status, "details": error or "ready"})


@app.route("/options", methods=["GET"])
def options():
    return jsonify(
        {
            "roles": ["buyer", "seller"],
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


@app.route("/roles", methods=["GET"])
def roles():
    return jsonify({"roles": ["buyer", "seller"]})


@app.route("/profiles", methods=["GET"])
def profiles():
    return jsonify({"profiles": get_users()})


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
    role = (payload.get("role") or "").strip().lower()

    if not message:
        return jsonify({"error": "message is required"}), 400

    error = validate_dependencies()
    if error is not None:
        return jsonify({"error": "Dependency configuration error", "details": error}), 500

    intent = route_intent(message)
    session_context = ""
    if role in {"buyer", "seller"}:
        session_context = f"User role: {role}\n"

    # Allow explicit profile override for recommendations
    if intent == "recommendation":
        users = get_users()
        if profile and profile in users:
            user_hint = f"User profile: {users[profile]['label']}\n"
            response = answer_recommendation_question(user_hint + message, session_context=session_context)
        else:
            response = answer_recommendation_question(message, session_context=session_context)
    elif intent == "market_analysis":
        response = answer_market_question(message)
    elif intent == "emissions":
        response = answer_emission_question(message, session_context=session_context)
    elif intent == "theory":
        response = answer_theory_question(message)
    elif intent == "insights":
        response = answer_insight_question(message)
    else:
        response = answer_market_question(message)

    return jsonify({"intent": intent, "response": response})


@app.route("/data/marketplace", methods=["GET"])
def marketplace_data():
    return jsonify({"marketplace": get_credits()})


@app.route("/data/sellers", methods=["GET"])
def sellers_data():
    return jsonify({"sellers": get_sellers()})


@app.route("/data/theory", methods=["GET"])
def theory_data():
    return jsonify({"theory": get_theory()})


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(host="127.0.0.1", port=port, debug=False)
