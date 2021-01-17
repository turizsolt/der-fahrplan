export const TEST_LEVEL = {
    "data": [
        {
            "id": "lckYtge8u",
            "type": "TrackJoint",
            "ray": {
                "x": 0,
                "y": 0,
                "z": 70,
                "dirXZ": 0
            },
            "A": {
                "track": "jM9_8lxGwv",
                "whichEnd": "B"
            },
            "B": null
        },
        {
            "id": "Aab9V9wq9Z",
            "type": "TrackJoint",
            "ray": {
                "x": 0,
                "y": 0,
                "z": 10,
                "dirXZ": 0
            },
            "A": null,
            "B": {
                "track": "jM9_8lxGwv",
                "whichEnd": "A"
            }
        },
        {
            "id": "jM9_8lxGwv",
            "type": "Track",
            "segment": [
                {
                    "x": 0,
                    "y": 0,
                    "z": 10
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 70
                }
            ]
        },
        {
            "id": "EqLkyRDJF",
            "type": "Wagon",
            "seatCount": 21,
            "seatColumns": 3,
            "seats": [],
            "config": {
                "maxSpeed": 3,
                "accelerateBy": 0.25,
                "controlType": 0,
                "passengerArrangement": {
                    "seats": 3,
                    "rows": 7
                },
                "appearanceId": "mot",
                "length": 14,
                "connectable": {
                    "A": 0,
                    "B": 0
                }
            },
            "A": {
                "whichEnd": "A",
                "endOf": "EqLkyRDJF",
                "positionOnTrack": {
                    "track": "jM9_8lxGwv",
                    "position": 41.74999999999662,
                    "percentage": 0.695833333333277,
                    "direction": 1
                },
                "otherEnd": false
            },
            "B": {
                "whichEnd": "B",
                "endOf": "EqLkyRDJF",
                "positionOnTrack": {
                    "track": "jM9_8lxGwv",
                    "position": 55.749999999996625,
                    "percentage": 0.9291666666666104,
                    "direction": 1
                },
                "otherEnd": false
            },
            "train": "vZeWTD3iDB"
        },
        {
            "id": "vZeWTD3iDB",
            "type": "Train",
            "wagons": [
                {
                    "side": "A",
                    "wagon": "EqLkyRDJF"
                }
            ]
        },
        {
            "id": "YXFxj9kA9",
            "type": "Platform",
            "track": "jM9_8lxGwv",
            "start": 0.75,
            "end": 0.875,
            "side": "Right",
            "width": 7.5
        },
        {
            "id": "9K*j_01KS",
            "type": "Platform",
            "track": "jM9_8lxGwv",
            "start": 0.125,
            "end": 0.25,
            "side": "Right",
            "width": 7.5
        },
        {
            "id": "zwvnZuGF*",
            "circle": {
                "x": 0,
                "y": 0,
                "z": 60,
                "r": 11.180339887498949
            },
            "type": "Station",
            "name": "Westmeadow"
        },
        {
            "id": "Kdt91oqpJ",
            "circle": {
                "x": 0,
                "y": 0,
                "z": 20,
                "r": 14.142135623730951
            },
            "type": "Station",
            "name": "Clearcrest"
        },
        {
            "id": "dEvgDRX2s",
            "type": "Route",
            "name": "1",
            "detailedName": "Westmeadow>>Clearcrest",
            "stops": [
                "evdpZzkvu",
                "jWcHTzVnZ_"
            ]
        },
        {
            "id": "evdpZzkvu",
            "type": "RouteStop",
            "station": "zwvnZuGF*",
            "platform": "YXFxj9kA9"
        },
        {
            "id": "jWcHTzVnZ_",
            "type": "RouteStop",
            "station": "Kdt91oqpJ",
            "platform": "9K*j_01KS"
        },
        {
            "id": "EK9rsX4mt",
            "type": "Route",
            "name": "1V",
            "detailedName": "Clearcrest>>Westmeadow",
            "stops": [
                "k50k*NT0_P",
                "uNrXY7kcG1"
            ]
        },
        {
            "id": "k50k*NT0_P",
            "type": "RouteStop",
            "station": "Kdt91oqpJ",
            "platform": "9K*j_01KS"
        },
        {
            "id": "uNrXY7kcG1",
            "type": "RouteStop",
            "station": "zwvnZuGF*",
            "platform": "YXFxj9kA9"
        },
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
    "_format": "fahrplan"
};
