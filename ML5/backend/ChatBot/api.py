from dotenv import load_dotenv
load_dotenv()

from flask_cors import CORS
import os

from flask import Flask, jsonify, request

from agents.router_agent import route_intent
from agents.market_agent import answer_market_question
from agents.recommendation_agent import answer_recommendation_question
from agents.emission_agent import answer_emission_question
from agents.theory_agent import answer_theory_question
from agents.insight_agent import answer_insight_question
from utils.data_store import get_credits, get_sellers, get_users, get_theory, save_user_footprint, get_user_footprint
from utils.helpers import get_groq_client
from utils.db import seed_if_empty

app = Flask(__name__)
CORS(app)



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

    print("Message received:", message)

    intent = "test"
    response = "Backend is connected successfully."

    return jsonify({
    "intent": intent,
    "response": response
})





@app.route("/chat", methods=["POST"])
def chat():
    try:
        payload = request.get_json(silent=True) or {}
        message = (payload.get("message") or "").strip()
        role = (payload.get("role") or "").strip().lower()
        user_id = (payload.get("user_id") or "").strip()

        print("CHAT HIT:", message, role, user_id)

        if not message:
            return jsonify({"error": "message is required"}), 400

        # Optional session context including user info
        session_context = ""
        if role in {"buyer", "seller"}:
            session_context = f"User role: {role}\n"
        if user_id:
            session_context += f"user_id: {user_id}\n"

        # Detect intent
        intent = route_intent(message)

        # Route to correct agent
        if intent == "recommendation":
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

        return jsonify({
            "intent": intent,
            "response": response
        })

    except Exception as e:
        print("CHAT ERROR:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



@app.route("/data/marketplace", methods=["GET"])
def marketplace_data():
    return jsonify({"marketplace": get_credits()})


@app.route("/data/sellers", methods=["GET"])
def sellers_data():
    return jsonify({"sellers": get_sellers()})


@app.route("/data/theory", methods=["GET"])
def theory_data():
    return jsonify({"theory": get_theory()})


@app.route("/footprint/save", methods=["POST"])
def save_footprint():
    """Save a user's carbon footprint calculation."""
    try:
        payload = request.get_json(silent=True) or {}
        user_id = (payload.get("user_id") or "").strip()
        footprint_data = payload.get("footprint_data", {})

        if not user_id:
            return jsonify({"error": "user_id is required"}), 400
        
        if not footprint_data:
            return jsonify({"error": "footprint_data is required"}), 400

        result = save_user_footprint(user_id, footprint_data)
        return jsonify({
            "status": "success",
            "message": "Footprint saved successfully",
            "data": result
        })

    except Exception as e:
        print("FOOTPRINT SAVE ERROR:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/footprint/get/<user_id>", methods=["GET"])
def get_footprint(user_id: str):
    """Retrieve a user's saved carbon footprint."""
    try:
        if not user_id:
            return jsonify({"error": "user_id is required"}), 400

        footprint = get_user_footprint(user_id)
        
        if not footprint:
            return jsonify({
                "status": "not_found",
                "message": "No footprint found for this user",
                "data": None
            })

        return jsonify({
            "status": "success",
            "data": footprint
        })

    except Exception as e:
        print("FOOTPRINT GET ERROR:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(host="127.0.0.1", port=port, debug=True, use_reloader=False)


