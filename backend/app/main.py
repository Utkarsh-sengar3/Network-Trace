import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api.network import router as network_router
from .api.crime import router as crime_router
from .api.synthetic import router as synthetic_router
from .api.ml import router as ml_router
from .api.analytics import router as analytics_router
from .services.graph_service import graph_service
from .services.crime_service import crime_service
from .services.synthetic_service import synthetic_service
from .services.ml_service import ml_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-warm services during startup
    print("Pre-warming NetworkTrace backend services...")
    graph_service.load_data()
    crime_service.load_data()
    synthetic_service.load_data()
    ml_service.load_data()
    print("All NetworkTrace backend services initialized.")
    yield
    print("Shutting down NetworkTrace backend...")

app = FastAPI(
    title="NetworkTrace Backend API",
    description="Graph-based network intelligence, Louvain community detection, bridge analysis, Crime in India contextual statistics, and supervised ML forecasting engine.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(round(process_time * 1000, 2)) + "ms"
    return response

# Register Routers
app.include_router(network_router)
app.include_router(crime_router)
app.include_router(synthetic_router)
app.include_router(ml_router)
app.include_router(analytics_router)

@app.get("/")
def root():
    return {
        "system": "NetworkTrace API",
        "status": "operational",
        "version": "1.0.0",
        "docs_url": "/docs",
        "responsible_use": "NetworkTrace clearly differentiates benchmark social graphs, macroscopic crime statistics, and synthetic scenarios."
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "services": {
            "graph_engine": "ready",
            "crime_context": "ready",
            "synthetic_network": "ready",
            "ml_forecasting": "ready"
        },
        "timestamp": time.time()
    }
