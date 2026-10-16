# NetworkTrace REST API Reference

Base URL: `http://127.0.0.1:8000`  
Interactive OpenAPI Swagger Docs: `http://127.0.0.1:8000/docs`

---

## 1. System & Health
* **`GET /api/health`**
  * Returns system readiness and service status.

---

## 2. Graph & Network Analytics
* **`GET /api/network/summary`**
  * Top-level metrics for benchmark ego network: 1,650 nodes, 151,766 edges, density = 0.111558, 8 communities.
* **`GET /api/network/nodes`**
  * Query parameters: `community_id` (0-7), `is_bridge` (bool), `search` (str), `limit` (int), `offset` (int).
* **`GET /api/network/graph-view`**
  * Returns Level-Of-Detail (LOD) sampled subgraph for high-FPS Cytoscape rendering.
* **`GET /api/network/node/{node_id}`**
  * Returns degree, betweenness, closeness, PageRank, and neighbor sample for a node.
* **`GET /api/network/node/{node_id}/neighborhood`**
  * Returns exact 1-hop or 2-hop ego subgraph.
* **`GET /api/network/communities`**
  * Returns 8 Louvain community profiles, sizes, internal/external densities, and anchors.
* **`GET /api/network/bridges`**
  * Returns ranked high-betweenness bridge entities.
* **`POST /api/network/shortest-path`**
  * Body: `{"source": "node_id_1", "target": "node_id_2"}`
  * Computes shortest path, hop count, and connecting edges.

---

## 3. Crime Context Statistics
* **`GET /api/crime/summary`**
  * Overview of 47.8M IPC incidents, 35 states/UTs, and 9,017 district records.
* **`GET /api/crime/yearly`**
  * Query parameters: `state` (optional).
  * Returns yearly total crime trajectory from 2001 to 2012.
* **`GET /api/crime/states`**
  * State-wise rankings and totals.
* **`GET /api/crime/districts`**
  * Query parameters: `state` (optional), `limit` (int).
  * Excludes aggregate `TOTAL` rows.
* **`GET /api/crime/categories`**
  * Incident volume and percentages across IPC categories.

---

## 4. Synthetic Criminal Network
* **`GET /api/synthetic/network`**
  * Multi-relational network containing 60 persons, 3 organizations, and 4 locations.
* **`GET /api/synthetic/summary`**
  * Breakdown of entity counts, relationship types, and disclaimer.

---

## 5. Supervised Machine Learning
* **`GET /api/ml/info`**
  * Supported supervised tasks, feature dictionary, and ethical disclaimers.
* **`GET /api/ml/metrics`**
  * Test metrics ($R^2$, MAE, RMSE) for Random Forest, Gradient Boosting, Ridge, and Synthetic Classifier.
* **`POST /api/ml/predict/crime`**
  * Live district IPC crime prediction from category incident counts.
* **`POST /api/ml/predict/synthetic-role`**
  * Live bridge probability classification from degree and betweenness parameters.
