# Tracks

## Track

Track is the path where trains are going. There are the following subtypes by shape:

- straight line (implemented as a zero-degree bezier)
- bezier curve (first-degree)
- *arc (not implemented yet)*

Also there is an other classification:

- normal track
- switch (or point in UK english, and wye switch)
- *special switches (three-way, double-slip, single-slip) (not implemented yet)*
- *crossover (not implemented yet)*

## TrackEnd

Is one of the two ends of a track, it connects to the next track's end.

## TrackJoint

Only a tool for editing tracks. A trackjoint has a coordinate and can contain two ends of tracks, which are aligned to each other. It is easier to join two tracks with this.

## TrackSwitch

Basically two tracks inside one. It dinamically changes which track is the active of the two.

## TrackSegment

Is the part of the track that contains the actual coordinates of the track, the curvature and so on.

## TrackWorm

A series of adjacent tracks joint together. It is used to see which tracks the train is on at the moment. Can add and remove only at the ends of the "worm"



Sources:\
https://en.wikipedia.org/wiki/Railroad_switch
