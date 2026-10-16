# NetworkTrace Architecture Documentation

## System Architecture

NetworkTrace is an end-to-end network intelligence and graph analytics platform combining topological graph theory, Louvain community detection, betweenness bridge analysis, macroscopic crime statistics, and supervised machine learning forecasting.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 14 FRONTEND (Port 3000)                 │
│  - Option F: Precision Intelligence Hybrid Visual Foundation           │
│  - Multi-Spectral 8-Community Louvain Coloring Palette                 │
│  - Cytoscape.js Force-Directed Canvas with Level-of-Detail Streaming   │
│  - Recharts Centrality, Yearly IPC Trajectory & Feature Weights        │
│  - Slide-Out Node Intelligence Drawer & Command-K Search               │
└────────────────────────────────────▲───────────────────────────────────┘
                                     │ REST JSON APIs
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI BACKEND (Port 8000)                     │
│  - Asynchronous FastAPI Service with CORS Middleware                   │
│  - GraphService: Ego Subgraph Extraction & Level-of-Detail Sampling    │
│  - CrimeService: District & State IPC Context Aggregator               │
│  - SyntheticService: Multi-Relational Simulation Engine                │
│  - MLService: Random Forest & Gradient Boosting Regressors             │
└────────────────────────────────────▲───────────────────────────────────┘
                                     │ Cached Loading
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      DATA & EMPIRICAL RESULTS LAYER                    │
│  - GPlus Benchmark: 1,650 nodes, 151,766 edges (Ego: 100129275726588) │
│  - Crime in India (2001-2012): 9,017 District Records (35 States/UTs)  │
│  - Synthetic Network: 60 Persons, 3 Organizations, 4 Locations         │
│  - Precomputed Analytics: Centrality distributions & Louvain partitions│
└────────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
NetwrokTrace/
├── backend/
│   ├── app/
│   │   ├── main.py              # Application entry point, CORS & lifespan
│   │   ├── config.py            # Paths, constants, and community colors
│   │   ├── api/                 # API route handlers
│   │   │   ├── network.py       # Graph & topology endpoints
│   │   │   ├── crime.py         # Crime context statistics endpoints
│   │   │   ├── synthetic.py     # Synthetic network endpoints
│   │   │   ├── ml.py            # Supervised ML endpoints
│   │   │   └── analytics.py     # Centrality & evaluation endpoints
│   │   ├── services/            # Core business logic & model pipelines
│   │   │   ├── graph_service.py # Subgraph caching & Dijkstra pathfinding
│   │   │   ├── crime_service.py # NCRB IPC aggregator
│   │   │   ├── synthetic_service.py # Multi-relational graph parser
│   │   │   └── ml_service.py    # Random Forest & Gradient Boosting models
│   │   └── schemas/             # Pydantic data validation schemas
│   └── requirements.txt
├── frontend/
│   ├── app/                     # 13 Next.js App Router Pages
│   │   ├── page.tsx             # Landing / Hero page
│   │   ├── dashboard/           # Executive Analytics Dashboard
│   │   ├── explorer/            # Interactive Network Explorer
│   │   ├── communities/         # 8 Louvain Community Clusters
│   │   ├── node-intelligence/   # Searchable Node Profiles & Ego Subgraphs
│   │   ├── bridge-analysis/     # Bridge Nodes & Bottleneck Analysis
│   │   ├── synthetic/           # Synthetic Criminal Simulation
│   │   ├── crime-context/       # Crime in India Statistical Dashboard
│   │   ├── ml/                  # Supervised ML Overview
│   │   ├── ml/model-performance/ # Live Simulator & Inference Playground
│   │   ├── methodology/         # Mathematical Foundations & Modularity
│   │   ├── about/               # Project Ethics & Responsible Use Charter
│   │   └── docs/                # REST Catalog & Developer Specs
│   ├── components/              # Cytoscape Graph, Topbar, Sidebar, Skeletons
│   ├── lib/                     # API client, TypeScript interfaces, constants
│   └── package.json
├── data/                        # Raw, processed, synthetic, and crime CSVs
├── results/                     # Precomputed Louvain & centrality results
└── docs/                        # Comprehensive technical documentation
```
