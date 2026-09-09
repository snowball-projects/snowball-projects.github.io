---
title: Choosing a Center Is Choosing an Objective
summary: The objective defines a road-network center; modo minimizes the longest drive and returns its one-minute near-optimal region.
destination: snowball
publishedDate: "2026-08-26"
updatedDate: "2026-09-06"
authors:
  - Nas Delevski
topics:
  - graph-theory
  - optimization
project: modo
draft: false
---

A road-network center depends on what we choose to minimize. The shortest combined drive and the shortest possible longest drive answer different questions.

## Road model

modo's hosted snapshot is a directed graph $G=(V,E)$ whose edges are weighted by travel time. After snapping each input coordinate to its nearest stored vertex, call the origins $o_1,\ldots,o_n$. Let $d_G(o_i,v)$ be the shortest modeled travel time from $o_i$ to candidate $v$. Candidates reachable from every origin form:

$$
R=\{v\in V\mid d_G(o_i,v)<\infty\text{ for every }i\}
$$

## Choosing an objective

The library supports two objectives:

$$
T(v)=\sum_{i=1}^{n}d_G(o_i,v),
\qquad
M(v)=\max_{1\le i\le n}d_G(o_i,v)
$$

$T$ minimizes total group travel; $M$ minimizes the longest individual trip. They can select different centers. modo's public interface deliberately uses only the maximum-time objective.

## Returning a region

When $R$ is nonempty, for $F\in\{T,M\}$ and $\Delta\ge0$, define the optimum and near-optimal region:

$$
F^*=\min_{v\in R}F(v),
\qquad
S_{F,\Delta}=\{v\in R\mid F(v)\le F^*+\Delta\}
$$

In the public interface, $F=M$ and $\Delta=60$ seconds. Every successful calculation returns all stored vertices whose longest trip is within one minute of the optimum. modo selects a deterministic $v_M^*\in\arg\min_{v\in R}M(v)$ for route display, but the region is the result.

A road isochrone is the set of vertices reachable from one origin within a time limit. For origin $i$ and limit $r$, define:

$$
B_i(r)=\{v\in V\mid d_G(o_i,v)\le r\}
$$

$$
M^*=\min\{r\mid\bigcap_i B_i(r)\ne\varnothing\},
\qquad
S_{M,\Delta}=\bigcap_i B_i(M^*+\Delta)
$$

The minimax region is therefore the intersection of all origins' reachable sets at time limit $M^*+\Delta$.

An optimal vertex may barely improve on its neighbors or shift after a small cost change. The region preserves those alternatives, even across disconnected components.

## Limits

The hosted calculation is exact only over an identified Chicago-area road snapshot with a declared static free-flow cost profile. It does not model traffic, departure times, or arrival deadlines. If no vertex is reachable from every origin, or a calculation exceeds service limits, modo reports that it cannot return a result. Returned vertices are not venue or safe-stop recommendations.
