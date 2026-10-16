# NetworkTrace Mathematical Methodology

## 1. Graph Definitions & Structural Metrics

Let $G = (V, E)$ be an undirected, unweighted network where $V$ represents nodes ($|V| = 1,650$) and $E$ represents edges ($|E| = 151,766$).

### Network Density
The density $\rho$ measures the ratio of actual edges to possible edges:
$$\rho = \frac{2|E|}{|V|(|V| - 1)} = \frac{2 \times 151,766}{1,650 \times 1,649} \approx 0.111558$$

### Average Degree
$$\langle k \rangle = \frac{1}{|V|} \sum_{v \in V} k_v \approx 183.96$$

---

## 2. Community Detection: Louvain Heuristic
Louvain modularity optimization partitions vertices into communities $C = \{c_1, c_2, \dots, c_k\}$ by maximizing:
$$Q = \frac{1}{2m} \sum_{i, j} \left[ A_{ij} - \frac{k_i k_j}{2m} \right] \delta(c_i, c_j)$$

On our selected ego network:
* Partition Count: 8 communities
* Resulting Modularity: $Q = 0.584$

---

## 3. Centrality Formulations

### Betweenness Centrality
Measures communication flow through node $v$:
$$C_B(v) = \sum_{s \neq v \neq t} \frac{\sigma_{st}(v)}{\sigma_{st}}$$
Where $\sigma_{st}$ is the total number of shortest paths from $s$ to $t$, and $\sigma_{st}(v)$ is the number of those paths passing through $v$.

### PageRank
Stationary probability distribution across network nodes:
$$PR(u) = \frac{1 - d}{N} + d \sum_{v \in M(u)} \frac{PR(v)}{L(v)}$$
Using damping factor $d = 0.85$.
