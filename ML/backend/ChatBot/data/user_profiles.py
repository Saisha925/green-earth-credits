# Dummy user personas to tailor recommendations

USER_PROFILES = {
    "corporate_buyer": {
        "label": "Corporate Buyer",
        "budget_usd": 100000,
        "priority": "Reliability and auditability",
        "preferred_project_types": ["Forest Conservation", "Renewables"],
        "risk_tolerance": "Low",
    },
    "startup": {
        "label": "Startup",
        "budget_usd": 15000,
        "priority": "Cost-effective offsets",
        "preferred_project_types": ["Solar", "Cookstove Efficiency"],
        "risk_tolerance": "Medium",
    },
    "individual": {
        "label": "Individual Climate-Conscious Buyer",
        "budget_usd": 2000,
        "priority": "High impact per dollar",
        "preferred_project_types": ["Forest Conservation", "Mangrove Restoration"],
        "risk_tolerance": "Medium",
    },
    "ngo": {
        "label": "NGO",
        "budget_usd": 50000,
        "priority": "Community and biodiversity co-benefits",
        "preferred_project_types": ["Cookstove Efficiency", "Mangrove Restoration"],
        "risk_tolerance": "Low",
    },
}
