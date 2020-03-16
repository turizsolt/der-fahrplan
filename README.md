# Technical aspects

## Track/TrackSegment

Track is an A--->B curve. It can be a line segment (linear bezier) A--->B or a curved (quadratic bezier) A---(I)--->B.

## PositionOnTrack

A position on a track. percent is in [0..1] intervallum. 0 means on the A end. 1 means on the B end.
A direction 1 means towards B, -1 means towards A.

### hop(distance: number)

Hopping the given distance in the PoT's direction.


## Wagon

Wagon is an A-->B subcurve on one or more tracks. Each Wagon has two ends (A, B), and on each end they have a PositionOnTrack property.

We can move a wagon towards A, if no other wagon is connected on the A end.
Also towards B.

A wagon can also pull other wagons, if they are connected.


