# ChatBot (Backend Only)

This is a fully self-contained terminal chatbot for carbon credit analysis and recommendations.
It uses the Groq API and dummy but realistic marketplace data.

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
```

Optional configuration:

```bash
export GROQ_MODEL=llama-3.1-70b-versatile
export GROQ_TEMPERATURE=0.4
export GROQ_MAX_TOKENS=800
```

## Run

```bash
python app.py
```

## What You Can Ask
- Market performance and demand
- Credit recommendations for different buyer types
- Emissions impact and offset calculations
- Theory questions (carbon markets, SDG 13, etc.)
- Insights from the dummy project data

## Notes
- This module does not depend on any other part of the codebase.
- Everything runs locally via terminal I/O.
