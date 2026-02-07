# GreenCredits Chatbot (Backend Only)

This is a terminal-based chatbot that acts as a conversational product assistant and intelligent agent router for a carbon marketplace platform. It uses the Groq API and fully populated dummy data to simulate realistic buyer and seller interactions.

The chatbot guides users to key platform features, handles free-text intent, and routes non-feature requests to specialized agents for market insights, recommendations, emissions impact, and theory explanations.

## Key Capabilities
- Mandatory buyer or seller role selection at session start
- Clear, business-friendly explanation of core platform features
- Mock redirects to features (text only)
- Free-text intent detection for feature requests
- Agent-based conversations with personalization
- Future-ready zero-data fallback logic (implemented but inactive)

## Core Features (Mock Links)
- Retire Credits → `/retire-credits`
- Certificate Authentication → `/certificate-auth`
- Carbon Footprint Calculator → `/carbon-footprint`
- ESG Report Generator → `/esg-report`

## Requirements
- Python 3.10+
- A Groq API key in your environment

## Setup

```bash
cd backend/ChatBot
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export GROQ_API_KEY=your_key_here
export MONGODB_URI=your_mongodb_atlas_uri
```

Optional configuration:

```bash
export GROQ_MODEL=groq/compound
export GROQ_TEMPERATURE=0.4
export GROQ_MAX_TOKENS=800
export MONGODB_DB_NAME=green_earth_chatbot
```

## Run

```bash
python app.py
```

## Run API

```bash
python api.py
```

## Conversation Flow
1. The chatbot asks for role selection:
   - “Before we begin, are you here as a Buyer or a Seller?”
2. A full dummy profile is loaded into session memory.
3. The chatbot introduces the four core features.
4. The user can:
   - Pick a feature by number or name
   - Ask in natural language
   - Ask other questions routed to specialized agents

## Personalization Rules
Buyer personalization uses:
- Seller marketplace data
- Seller trust score
- Credit availability and quality signals

Seller personalization uses:
- Buyer demand signals
- Buyer emissions trends
- Offset potential

The chatbot keeps responses advisory and business-friendly, and avoids unnecessary raw numbers.

## Data Sources (Dummy Data)
All data is local and fully populated for testing:
- `data/marketplace_data.py`
- `data/seller_profiles.py`
- `data/user_profiles.py`
- `data/theory_knowledge.py`
- `data/session_profiles.py` (session buyer/seller profiles)

## Exit Behavior
The chatbot exits gracefully on inputs such as:
- `no`
- `thanks`
- `that’s all`
- `nothing else`

## Notes
- This module runs standalone and does not depend on the frontend.
- All feature links are mock-only and for text display.
- Zero-data fallback logic exists but is disabled by default.
