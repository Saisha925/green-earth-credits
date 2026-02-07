import os
from pymongo import MongoClient

from data.marketplace_data import MARKETPLACE_CREDITS
from data.seller_profiles import SELLER_PROFILES
from data.user_profiles import USER_PROFILES
from data.theory_knowledge import THEORY_KNOWLEDGE
from data.session_profiles import BUYER_PROFILE, SELLER_PROFILE


def get_client():
    uri = os.getenv("MONGODB_URI")
    if not uri:
        raise ValueError("MONGODB_URI is not set in the environment.")
    return MongoClient(uri)


def seed():
    db_name = os.getenv("MONGODB_DB_NAME", "green_earth_chatbot")
    client = get_client()
    db = client[db_name]

    # Credits
    if db.credits.count_documents({}) == 0:
        db.credits.insert_many(MARKETPLACE_CREDITS)
        print("Seeded credits")
    else:
        print("Credits already exist")

    # Sellers
    if db.sellers.count_documents({}) == 0:
        sellers = []
        for seller_id, profile in SELLER_PROFILES.items():
            doc = dict(profile)
            doc["seller_id"] = seller_id
            sellers.append(doc)
        db.sellers.insert_many(sellers)
        print("Seeded sellers")
    else:
        print("Sellers already exist")

    # Users
    if db.users.count_documents({}) == 0:
        users = []
        for key, profile in USER_PROFILES.items():
            doc = dict(profile)
            doc["profile_key"] = key
            users.append(doc)
        db.users.insert_many(users)
        print("Seeded users")
    else:
        print("Users already exist")

    # Theory
    if db.theory.count_documents({}) == 0:
        theory_docs = []
        for key, value in THEORY_KNOWLEDGE.items():
            theory_docs.append({"topic": key, "content": value})
        db.theory.insert_many(theory_docs)
        print("Seeded theory")
    else:
        print("Theory already exists")

    # Session Profiles
    if db.session_profiles.count_documents({}) == 0:
        db.session_profiles.insert_many([BUYER_PROFILE, SELLER_PROFILE])
        print("Seeded session profiles")
    else:
        print("Session profiles already exist")


if __name__ == "__main__":
    seed()
