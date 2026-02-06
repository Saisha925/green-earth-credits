# Theory and explanation agent

from data.theory_knowledge import THEORY_KNOWLEDGE
from utils.prompt_templates import THEORY_AGENT_SYSTEM
from utils.helpers import llm_chat


def build_theory_context() -> str:
    lines = []
    for key, value in THEORY_KNOWLEDGE.items():
        lines.append(f"{key}: {value}")
    return "\n".join(lines)


def answer_theory_question(user_input: str, session_context: str = "") -> str:
    context = build_theory_context()
    prompt = (
        "User question: " + user_input + "\n\n" +
        "Theory reference:\n" + context + "\n\n" +
        "User profile context:\n" + session_context +
        "\n\nAnswer clearly and simply."
    )
    return llm_chat(THEORY_AGENT_SYSTEM, prompt)
