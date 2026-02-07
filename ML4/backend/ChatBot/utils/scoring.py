# Utility functions for scoring and ranking credits/sellers

from typing import List, Dict


def compute_value_score(credit: Dict) -> float:
    # Higher demand and higher emissions offset per dollar = higher value
    price = max(credit.get("price_usd", 1.0), 1.0)
    offset = credit.get("emissions_offset_tons", 0.0)
    demand = credit.get("demand_score", 0.0)
    offset_per_dollar = offset / price
    return (0.6 * demand) + (0.4 * offset_per_dollar)


def rank_credits(credits: List[Dict]) -> List[Dict]:
    return sorted(credits, key=compute_value_score, reverse=True)


def compute_trust_score(seller_profile: Dict) -> float:
    base = seller_profile.get("trust_score", 0)
    volume = seller_profile.get("past_sales_volume", 0)
    # Small boost for volume to represent market confidence
    return base + min(volume / 1000, 5)
