from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float
    description: Optional[str] = None

class ModelMetrics(BaseModel):
    model_name: str
    task_type: str # regression, classification
    target_variable: str
    dataset_name: str
    train_samples: int
    test_samples: int
    metrics: Dict[str, float] # R2, MAE, RMSE, or Accuracy, Precision, Recall, F1
    feature_importances: List[FeatureImportanceItem] = []
    confusion_matrix: Optional[List[List[int]]] = None
    labels: Optional[List[str]] = None
    validation_notes: str

class MLInfoResponse(BaseModel):
    available_models: List[str]
    tasks: List[Dict[str, Any]]
    disclaimer: str

class CrimePredictRequest(BaseModel):
    state: Optional[str] = "MAHARASHTRA"
    burglary: float = 1200.0
    theft: float = 3500.0
    robbery: float = 450.0
    riots: float = 800.0
    cheating: float = 950.0
    murder: float = 180.0
    kidnapping: float = 220.0
    historical_rolling_avg: float = 8000.0

class CrimePredictResponse(BaseModel):
    predicted_total_ipc: float
    confidence_interval: Dict[str, float]
    risk_level: str
    contributing_factors: List[Dict[str, Any]]
    model_used: str

class SyntheticRolePredictRequest(BaseModel):
    degree: int = 8
    betweenness_centrality: float = 0.045
    cross_org_links: int = 3
    connected_locations_count: int = 2

class SyntheticRolePredictResponse(BaseModel):
    is_bridge_predicted: bool
    bridge_probability: float
    entity_role_predicted: str
    explanation: str
