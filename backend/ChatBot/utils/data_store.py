from typing import List, Dict, Optional

from utils.db import get_db, seed_if_empty
from datetime import datetime


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


def save_user_footprint(user_id: str, footprint_data: Dict) -> Dict:
    """Save a user's calculated carbon footprint to the database."""
    db = get_db()
    
    # Add timestamp
    footprint_data["user_id"] = user_id
    footprint_data["timestamp"] = datetime.utcnow().isoformat()
    
    # Replace if exists, insert if new (upsert)
    result = db.user_footprints.update_one(
        {"user_id": user_id},
        {"$set": footprint_data},
        upsert=True
    )
    
    # Return the saved document
    saved = db.user_footprints.find_one({"user_id": user_id})
    return {k: v for k, v in saved.items() if k != "_id"}


def get_user_footprint(user_id: str) -> Optional[Dict]:
    """Retrieve a user's latest carbon footprint calculation."""
    db = get_db()
    footprint = db.user_footprints.find_one({"user_id": user_id})
    if footprint:
        return {k: v for k, v in footprint.items() if k != "_id"}
    return None


def format_footprint_for_chat(footprint: Dict) -> str:
    """Format a footprint dictionary into a readable string for chat agents."""
    if not footprint:
        return "No carbon footprint has been calculated yet."
    
    total_emissions = footprint.get("totalEmissions", 0)
    dominant_sector = footprint.get("dominantSector", "unknown")
    suggested_credits = footprint.get("suggestedCredits", 0)
    tree_equivalent = footprint.get("treeEquivalent", 0)
    breakdown = footprint.get("breakdown", [])
    
    lines = [
        f"Annual Carbon Footprint: {total_emissions:.2f} tonnes CO2 equivalent",
        f"Dominant Sector: {dominant_sector}",
        f"Suggested Credits to Offset: {suggested_credits:.0f}",
        f"Equivalent to Trees Needed to Offset: {tree_equivalent:.0f}",
    ]
    
    if breakdown:
        lines.append("\nBreakdown by Category:")
        for item in breakdown:
            name = item.get("name", "Unknown")
            percentage = item.get("percentage", 0)
            value = item.get("value", 0)
            lines.append(f"  • {name}: {value:.2f} tonnes ({percentage:.1f}%)")
    
    return "\n".join(lines)
