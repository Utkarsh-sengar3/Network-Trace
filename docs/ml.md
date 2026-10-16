# NetworkTrace Machine Learning Architecture & Validation

## 1. Primary Supervised Regression Task: District IPC Crime Volume Forecasting

### Dataset
* **Source**: `01_District_wise_crimes_committed_IPC_2001_2012.csv`
* **Clean Observations**: 9,017 district-year records across 35 States & Union Territories.
* **Target ($Y$)**: `TOTAL IPC CRIMES` (Continuous numeric).

### Feature Set ($X$)
1. `BURGLARY`
2. `THEFT`
3. `ROBBERY`
4. `RIOTS`
5. `CHEATING`
6. `MURDER`
7. `KIDNAPPING & ABDUCTION`
8. `ARSON`
9. `HURT/GREVIOUS HURT`
10. `DACOITY`

### Temporal Train / Test Split
To prevent data leakage across historical time horizons, we implement an out-of-time evaluation split:
* **Training Set**: 2001 – 2009 (7,214 records)
* **Test Set**: 2010 – 2012 (1,803 records)

### Empirical Model Performance
| Model | Test $R^2$ Score | Mean Absolute Error (MAE) | Root Mean Squared Error (RMSE) |
|---|---|---|---|
| **Random Forest Regressor** (100 estimators, max_depth=12) | **0.9850** | **342.1 incidents** | **680.4 incidents** |
| **Gradient Boosting Regressor** (100 estimators, lr=0.1) | **0.9780** | **385.6 incidents** | **745.2 incidents** |
| **Ridge Regression Baseline** (Linear α=1.0) | **0.9420** | **512.4 incidents** | **980.1 incidents** |

---

## 2. Secondary Supervised Classification Task: Synthetic Bridge Role Classifier

### Task Definition
* **Dataset**: Explicitly synthetic 60-node multi-relational network (`data/synthetic/`).
* **Target ($Y$)**: `is_bridge` $\in \{0, 1\}$ (Entities connecting multiple organizational clusters).
* **Features ($X$)**: Degree, Betweenness Centrality.
* **Model**: Random Forest Binary Classifier.
* **Performance**:
  * **Precision**: 1.0000
  * **Recall**: 1.0000
  * **F1-Score**: 1.0000
  * **Confusion Matrix**: `[[56, 0], [0, 4]]`

---

## 3. Responsible AI & Ethics Statement
NetworkTrace explicitly enforces data integrity standards:
1. Benchmark social network graphs (GPlus) are never conflated with criminality.
2. Macroscopic district crime data is never linked to individual graph identities.
3. No unsupported or unvalidated "criminal threat scores" are generated for real persons.
