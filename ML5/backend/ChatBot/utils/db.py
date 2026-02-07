import os
from typing import Dict

from pymongo import MongoClient

from config import MONGODB_URI, MONGODB_DB_NAME
from data.marketplace_data import MARKETPLACE_CREDITS
from data.seller_profiles import SELLER_PROFILES
from data.user_profiles import USER_PROFILES
from data.theory_knowledge import THEORY_KNOWLEDGE
from data.session_profiles import BUYER_PROFILE, SELLER_PROFILE

_client = None


def get_client() -> MongoClient:
    global _client
    if _client is None:
        if not MONGODB_URI:
            raise ValueError("MONGODB_URI is not set in the environment.")
        _client = MongoClient(MONGODB_URI)
    return _client


def get_db():
    client = get_client()
    return client[MONGODB_DB_NAME]


def seed_if_empty() -> Dict[str, int]:
    db = get_db()
    counts = {}

    if db.credits.count_documents({}) == 0:
        db.credits.insert_many(MARKETPLACE_CREDITS)
    counts["credits"] = db.credits.count_documents({})

    if db.sellers.count_documents({}) == 0:
        sellers = []
        for seller_id, profile in SELLER_PROFILES.items():
            doc = dict(profile)
            doc["seller_id"] = seller_id
            sellers.append(doc)
        db.sellers.insert_many(sellers)
    counts["sellers"] = db.sellers.count_documents({})

    if db.users.count_documents({}) == 0:
        users = []
        for key, profile in USER_PROFILES.items():
            doc = dict(profile)
            doc["profile_key"] = key
            users.append(doc)
        db.users.insert_many(users)
    counts["users"] = db.users.count_documents({})

    if db.theory.count_documents({}) == 0:
        theory_docs = []
        for key, value in THEORY_KNOWLEDGE.items():
            theory_docs.append({"topic": key, "content": value})
        db.theory.insert_many(theory_docs)
    counts["theory"] = db.theory.count_documents({})

    if db.session_profiles.count_documents({}) == 0:
        db.session_profiles.insert_many([BUYER_PROFILE, SELLER_PROFILE])
    counts["session_profiles"] = db.session_profiles.count_documents({})

    return counts
