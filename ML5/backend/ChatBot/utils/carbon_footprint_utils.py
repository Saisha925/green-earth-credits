"""Utilities for managing user carbon footprints"""

from typing import Dict, Optional
from datetime import datetime
from utils.data_store import get_db


def save_user_footprint(user_id: str, footprint_data: Dict) -> Dict:
    """
    Save a user's calculated carbon footprint to the database.
    
    Args:
        user_id: Unique identifier for the user
        footprint_data: Dictionary containing footprint calculation results
        
    Returns:
        The saved footprint document
    """
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
    """
    Retrieve a user's latest carbon footprint calculation.
    
    Args:
        user_id: Unique identifier for the user
        
    Returns:
        The footprint document or None if not found
    """
    db = get_db()
    footprint = db.user_footprints.find_one({"user_id": user_id})
    if footprint:
        return {k: v for k, v in footprint.items() if k != "_id"}
    return None


def format_footprint_for_chat(footprint: Dict) -> str:
    """
    Format a footprint dictionary into a readable string for chat agents.
    
    Args:
        footprint: The footprint data
        
    Returns:
        Formatted string describing the footprint
    """
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
