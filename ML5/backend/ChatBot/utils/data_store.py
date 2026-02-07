from typing import List, Dict

from utils.db import get_db, seed_if_empty


def ensure_seeded():
    seed_if_empty()


def get_credits() -> List[Dict]:
    ensure_seeded()
    db = get_db()
    return list(db.credits.find({}, {"_id": 0}))


def get_sellers() -> Dict[str, Dict]:
    ensure_seeded()
    db = get_db()
    sellers = list(db.sellers.find({}, {"_id": 0}))
    return {s["seller_id"]: s for s in sellers}


def get_users() -> Dict[str, Dict]:
    ensure_seeded()
    db = get_db()
    users = list(db.users.find({}, {"_id": 0}))
    return {u["profile_key"]: u for u in users}


def get_theory() -> Dict[str, str]:
    ensure_seeded()
    db = get_db()
    theory = list(db.theory.find({}, {"_id": 0}))
    return {t["topic"]: t["content"] for t in theory}


def get_session_profiles() -> Dict[str, Dict]:
    ensure_seeded()
    db = get_db()
    profiles = list(db.session_profiles.find({}, {"_id": 0}))
    return {p["role"]: p for p in profiles if p.get("role")}


def get_session_profile(role: str) -> Dict:
    profiles = get_session_profiles()
    return profiles.get(role, {"role": role})
