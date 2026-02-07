import os

# Centralized model configuration
MODEL_NAME = os.getenv("GROQ_MODEL", "groq/compound")
TEMPERATURE = float(os.getenv("GROQ_TEMPERATURE", "0.4"))
MAX_TOKENS = int(os.getenv("GROQ_MAX_TOKENS", "800"))

# Groq API key (must be provided in environment)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# MongoDB configuration
MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "green_earth_chatbot")
