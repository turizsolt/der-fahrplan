import { ActualTrack } from "../structs/Actuals/Track/ActualTrack";

export const TestFw = {
    "data": [
        {
            "id": "jA58yT_Hz",
            "type": "TrackJoint",
            "ray": {
                "x": -10,
                "y": 0,
                "z": 20,
                "dirXZ": 0
            },
            "A": null,
            "B": {
                "track": "Hpis46DQlw",
                "whichEnd": "B"
            }
        },
        {
            "id": "8k3FdjfOtE",
            "type": "TrackJoint",
            "ray": {
                "x": -10,
                "y": 0,
                "z": 40,
                "dirXZ": 0
            },
            "A": {
                "track": "Hpis46DQlw",
                "whichEnd": "A"
            },
            "B": null
        },
        {
            "id": "Hpis46DQlw",
            "type": "Track",
            "segment": [
                {
                    "x": -10,
                    "y": 0,
                    "z": 40
                },
                {
                    "x": -10,
                    "y": 0,
                    "z": 20
                }
            ]
        }
    ],
    "camera": {
        "alpha": 0,
        "beta": 0.8,
        "radius": 70,
        "target": {
            "x": 0,
            "y": 0,
            "z": 30
        },
        "position": {
            "x": 50.214926362966594,
            "y": 48.769469654301574,
            "z": 30
        }
    },
    "_version": 1,
    "_format": "fahrplan",
    "actions": [
        {
            "type": "assertion",
            "object": "Hpis46DQlw",
            "function": "isEmpty",
            "params": [],
            "equalsTo": true
        }
    ]
};
