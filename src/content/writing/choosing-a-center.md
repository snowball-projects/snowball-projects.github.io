---
title: Choosing a Center Is Choosing an Objective
summary: Road graphs, competing travel-time objectives, and near-optimal regions turn different ideas of fairness into different centers.
publishedDate: 2026-08-26
updatedDate: 2026-08-31
authors:
  - Nas Delevski
project: modo
draft: false
---

modo begins with a familiar problem: several people are starting from different places, and they want to identify a road-network region that keeps their driving times near an optimum.

The problem sounds simple, but roads are not straight lines. They contain one-way streets, highways, bridges, intersections, and different travel speeds. modo represents those details with a road graph. Its reusable library can evaluate two ideas of what “optimal” should mean, while the public interface deliberately uses only the maximum-time objective.

## Representing the road network

modo models the road network as:

$$
G=(V,E)
$$

Here:

- $G$ is the road graph being evaluated.
- $V$ is the set of road vertices, such as intersections and routing points.
- $E$ is the set of road edges connecting those vertices.

Each edge has a permitted direction and a travel-time cost. Direction matters because a road may be one-way, or traveling in opposite directions may take different amounts of time.

Suppose the origins are:

$$
o_1,o_2,\ldots,o_n
$$

For a possible destination vertex $v$, modo defines:

$$
d_G(o_i,v)
$$

This is the shortest driving time from origin $o_i$ to vertex $v$.

Some vertices may not be reachable from every origin. modo therefore evaluates the mutually reachable set:

$$
R=\{v\in V\mid d_G(o_i,v)<\infty\text{ for every }i\}
$$

$R$ contains every road vertex that all travelers can reach.

## Total-time library objective

For a candidate vertex $v$, the reusable Python library can instead minimize the group’s combined travel time:

$$
T(v)=\sum_{i=1}^{n}d_G(o_i,v)
$$

The best total time and its near-optimal region are:

$$
T^*=\min_{v\in R}T(v)
$$

$$
S_{T,\Delta}=\{v\in R\mid T(v)\le T^*+\Delta\}
$$

This minimizes aggregate burden, but it is not exposed in the public interface.

## Maximum-time product objective

The public interface focuses on the traveler with the longest trip.

For each candidate vertex, modo keeps the largest individual travel time:

$$
M(v)=\max_{1\le i\le n}d_G(o_i,v)
$$

The optimal vertex is:

$$
v_M^*=\arg\min_{v\in R}M(v)
$$

The best possible maximum travel time is:

$$
M^*=M(v_M^*)
$$

The near-optimal maximum-time region is:

$$
S_{M,\Delta}
=
\{v\in R\mid M(v)\le M^*+\Delta\}
$$

With a 60-second buffer, this contains every vertex where the longest individual trip remains within one minute of the best possible longest trip.

The two objectives answer different questions. modo’s public interface fixes the choice in favor of the longest drive rather than asking users to decide.

## Understanding the maximum-time region through isochrones

An isochrone is the set of road vertices reachable from one origin within a given amount of time.

For origin $i$, define:

$$
B_i(r)=\{v\in V\mid d_G(o_i,v)\le r\}
$$

Here, $r$ is a travel-time limit.

The best maximum travel time is the smallest limit for which every origin’s isochrone shares at least one vertex:

$$
M^*
=
\min\{r\mid\bigcap_i B_i(r)\ne\varnothing\}
$$

Once $M^*$ is known, the near-optimal region is:

$$
S_{M,\Delta}
=
\bigcap_i B_i(M^*+\Delta)
$$

Expand every traveler’s reachable region until they overlap, then include the shared vertices allowed by the buffer.

## Why the result is a region

The mathematically best vertex may be only slightly better than many nearby vertices. Small changes in road speeds can also move the exact winner without materially changing the surrounding area.

For that reason, modo’s primary mathematical result is a near-optimal road region rather than only one supposedly perfect point.

The region may be a compact cluster, road corridor, disconnected set, or single vertex. modo selects one exact optimum for route display, while the region communicates the broader answer.

## Limits

Current results use static edge costs, not traffic or departure time. The routed optimum is a deterministic representative of the region, not a venue recommendation.
