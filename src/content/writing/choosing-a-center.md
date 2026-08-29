---
title: Choosing a Center Is Choosing an Objective
summary: Road graphs, competing travel-time objectives, and near-optimal regions turn different ideas of fairness into different centers.
publishedDate: 2026-08-26
updatedDate: 2026-08-29
authors:
  - Nas Delevski
topics:
  - Optimization
  - Geospatial computing
  - Graph algorithms
project: modo
draft: false
---

modo begins with a familiar problem: several people are starting from different places, and they want to identify a road-network region that keeps their driving times near an optimum.

The problem sounds simple, but roads are not straight lines. They contain one-way streets, highways, bridges, intersections, and different travel speeds. modo's current development version represents those details with a road graph and evaluates two different ideas of what “optimal” should mean.

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

The symbol $n$ is the number of origins, while $o_i$ means origin number $i$.

For a possible destination vertex $v$, modo defines:

$$
d_G(o_i,v)
$$

This is the shortest driving time through graph $G$ from origin $o_i$ to vertex $v$.

Some vertices may not be reachable from every origin. modo therefore evaluates the mutually reachable set:

$$
R=\{v\in V\mid d_G(o_i,v)<\infty\text{ for every }i\}
$$

In plain language, $R$ contains every road vertex that all travelers can reach.

## Total-time mode

The first optimization mode minimizes the group’s combined travel time.

For a candidate vertex $v$, add every traveler’s driving time:

$$
T(v)=\sum_{i=1}^{n}d_G(o_i,v)
$$

The symbol $\sum$ means “add all of these values.”

The average travel time is:

$$
A(v)=\frac{T(v)}{n}
$$

Minimizing the total and minimizing the average produce the same optimal vertex:

$$
v_T^*=\arg\min_{v\in R}T(v)
$$

The expression $\arg\min$ means “return the vertex that produces the smallest value.” The star indicates an optimal result.

The best total time is:

$$
T^*=T(v_T^*)
$$

The best average travel time is:

$$
A^*=A(v_T^*)=\frac{T^*}{n}
$$

modo does not need to treat only that single vertex as meaningful. Let $\Delta$ be an accepted buffer in seconds on the combined objective. The near-optimal total-time region is:

$$
S_{T,\Delta}
=
\{v\in R\mid T(v)\le T^*+\Delta\}
=
\left\{v\in R\mid A(v)\le A^*+\frac{\Delta}{n}\right\}
$$

With a 60-second buffer, this region contains every vertex whose combined group travel time is within one minute of the best possible total.

For four travelers, that is equivalent to permitting up to 15 additional seconds in the average trip because:

$$
\frac{\Delta}{n}=\frac{60}{4}=15\text{ seconds}
$$

## Maximum-time mode

The second mode focuses on the traveler with the longest trip.

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

Total-time mode minimizes the group’s combined burden. Maximum-time mode protects the person facing the longest drive. Neither objective is universally better. They answer different versions of the same question.

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

The symbol $\bigcap$ means intersection, or the region shared by all the sets. The symbol $\varnothing$ means an empty set.

Once $M^*$ is known, the near-optimal region is:

$$
S_{M,\Delta}
=
\bigcap_i B_i(M^*+\Delta)
$$

This gives a direct interpretation of maximum-time mode: expand every traveler’s reachable region until they overlap, then include the shared vertices allowed by the buffer.

## Why the result is a region

The mathematically best vertex may be only slightly better than many nearby vertices. Small changes in road speeds can also move the exact winner without materially changing the surrounding area.

For that reason, modo’s primary mathematical result is a near-optimal road region rather than only one supposedly perfect point.

The region might be:

- A compact cluster of intersections.
- A corridor following a fast road.
- Several disconnected groups of vertices.
- A single vertex when the optimum is especially sharp.

modo can still select one exact optimum as a representative coordinate, but the surrounding region communicates the full answer.

## Static and traffic-dependent travel times

The current modo model assigns each road edge a constant travel time:

$$
w_e=\text{constant}
$$

Here, $w_e$ is the time required to traverse edge $e$.

Future traffic-aware routing would make that cost depend on when the traveler enters the edge:

$$
w_e(t)
=
\text{time to traverse edge }e\text{ when entered at time }t
$$

The shortest route would then depend on the requested departure time $t_0$:

$$
d_G(o_i,v;t_0)
$$

The two objectives become time-specific:

$$
T(v,t_0)
=
\sum_{i=1}^{n}d_G(o_i,v;t_0)
$$

$$
M(v,t_0)
=
\max_{1\le i\le n}d_G(o_i,v;t_0)
$$

If $f$ represents whichever objective was selected, the time-specific region is:

$$
S_\Delta(t_0)
=
\{v\mid f(v,t_0)\le f^*(t_0)+\Delta\}
$$

This allows the optimal road region to change with expected traffic.

For an arrive-by calculation, let $T$ be the required arrival time and let $L_i(v,T)$ be the latest time traveler $i$ can leave and still reach $v$ by $T$. The trip duration is:

$$
D_i(v,T)=T-L_i(v,T)
$$

A time-dependent road model should also satisfy the FIFO property:

$$
t_2\ge t_1
\Rightarrow
t_2+w_e(t_2)\ge t_1+w_e(t_1)
$$

This says that entering the same road later should not allow someone to exit before a traveler who entered earlier. That property allows time-dependent shortest-path algorithms to behave predictably.

Traffic-aware routing is not implemented in modo yet, but these formulas extend the existing model without changing its two central objectives.

## The complete idea

At its core, modo performs four steps:

1. Represent roads as a graph.
2. Calculate driving times from every origin.
3. Combine those times using either total-time or maximum-time mode.
4. Return every road vertex within the accepted buffer of the optimum.

The result is not merely a midpoint on a map. It is a road-network region defined by the driving-time objective the user chooses.
