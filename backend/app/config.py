from pathlib import Path

# Project Root is two levels above backend/app (i.e. NetwrokTrace)
APP_DIR = Path(__file__).resolve().parent
BACKEND_DIR = APP_DIR.parent
PROJECT_ROOT = BACKEND_DIR.parent

DATA_DIR = PROJECT_ROOT / "data"
RESULTS_DIR = PROJECT_ROOT / "results"

PROCESSED_DATA_DIR = DATA_DIR / "processed"
SYNTHETIC_DATA_DIR = DATA_DIR / "synthetic"
CRIME_DATA_DIR = DATA_DIR / "crime_context"
GPLUS_RAW_DIR = DATA_DIR / "raw" / "gplus"

COMMUNITY_RESULTS_DIR = RESULTS_DIR / "community_detection"
INTELLIGENCE_RESULTS_DIR = RESULTS_DIR / "community_intelligence"
EVALUATION_RESULTS_DIR = RESULTS_DIR / "evaluation"
ANALYTICS_RESULTS_DIR = RESULTS_DIR / "network_analytics"
SYNTHETIC_RESULTS_DIR = RESULTS_DIR / "synthetic_criminal_network"
CRIME_RESULTS_DIR = RESULTS_DIR / "crime_context"

# Selected Ego Network ID
EGO_ID = "100129275726588145876"

# Color palette for 8 Louvain communities (Option F: Multi-Spectral)
COMMUNITY_COLORS = [
    "#06B6D4", # Community 0 - Cyan
    "#8B5CF6", # Community 1 - Violet
    "#10B981", # Community 2 - Emerald
    "#F59E0B", # Community 3 - Amber
    "#F43F5E", # Community 4 - Rose
    "#6366F1", # Community 5 - Indigo
    "#3B82F6", # Community 6 - Blue
    "#14B8A6", # Community 7 - Teal
]
