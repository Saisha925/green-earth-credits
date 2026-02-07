# Theory and explanation agent

from utils.data_store import get_theory
from utils.prompt_templates import THEORY_AGENT_SYSTEM
from utils.helpers import llm_chat


def build_theory_context() -> str:
    lines = []
    theory = get_theory()
    for key, value in theory.items():
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
