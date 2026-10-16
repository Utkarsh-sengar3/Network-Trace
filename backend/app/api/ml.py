from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from ..services.ml_service import ml_service
from ..schemas.ml_schema import (
    MLInfoResponse,
    CrimePredictRequest,
    CrimePredictResponse,
    SyntheticRolePredictRequest,
    SyntheticRolePredictResponse
)

router = APIRouter(prefix="/api/ml", tags=["Machine Learning Engine"])

@router.get("/info", response_model=MLInfoResponse)
def get_ml_info():
    """Information on supported supervised ML tasks and models."""
    return ml_service.get_info()

@router.get("/metrics")
def get_ml_metrics():
    """Returns R², MAE, RMSE, Confusion Matrix, and Feature Importances."""
    return ml_service.get_metrics()

@router.post("/predict/crime", response_model=CrimePredictResponse)
def predict_crime(payload: CrimePredictRequest):
    """
    Live supervised regression prediction of district-level total IPC crimes
    based on category incident vectors and historical trends.
    """
    features = {
        "BURGLARY": payload.burglary,
        "THEFT": payload.theft,
        "ROBBERY": payload.robbery,
        "RIOTS": payload.riots,
        "CHEATING": payload.cheating,
        "MURDER": payload.murder,
        "KIDNAPPING & ABDUCTION": payload.kidnapping,
    }
    return ml_service.predict_crime(features)

@router.post("/predict/synthetic-role", response_model=SyntheticRolePredictResponse)
def predict_synthetic_role(payload: SyntheticRolePredictRequest):
    """
    Live supervised classification predicting whether a synthetic node behaves
    as a cross-community bridge connector.
    """
    return ml_service.predict_synthetic_role(payload.degree, payload.betweenness_centrality)
