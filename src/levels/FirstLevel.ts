export const FIRST_LEVEL = {
    "data": [
        {
            "id": "rOHwT3GaP",
            "type": "TrackJoint",
            "ray": {
                "x": 0,
                "y": 0,
                "z": -90,
                "dirXZ": 0
            },
            "A": null,
            "B": {
                "track": "XNLZQqohCJ",
                "whichEnd": "B"
            }
        },
        {
            "id": "L8uiyZu3Bg",
            "type": "TrackJoint",
            "ray": {
                "x": 0,
                "y": 0,
                "z": 90,
                "dirXZ": 0
            },
            "A": {
                "track": "XNLZQqohCJ",
                "whichEnd": "A"
            },
            "B": null
        },
        {
            "id": "XNLZQqohCJ",
            "type": "Track",
            "segment": [
                {
                    "x": 0,
                    "y": 0,
                    "z": 90
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": -90
                }
            ]
        },
        {
            "id": "7fvUb1erL",
            "type": "Platform",
            "track": "XNLZQqohCJ",
            "start": 0.875,
            "end": 1,
            "side": "Right",
            "width": 7.5
        },
        {
            "id": "IZDHoLy2u",
            "type": "Platform",
            "track": "XNLZQqohCJ",
            "start": 0,
            "end": 0.125,
            "side": "Right",
            "width": 7.5
        },
        {
            "id": "2WUuRT8EO",
            "type": "Wagon",
            "seatCount": 21,
            "seatColumns": 3,
            "seats": [

            ],
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
                "endOf": "2WUuRT8EO",
                "positionOnTrack": {
                    "track": "XNLZQqohCJ",
                    "position": 157.5,
                    "percentage": 0.875,
                    "direction": 1
                },
                "otherEnd": false
            },
            "B": {
                "whichEnd": "B",
                "endOf": "2WUuRT8EO",
                "positionOnTrack": {
                    "track": "XNLZQqohCJ",
                    "position": 171.5,
                    "percentage": 0.9527777777777777,
                    "direction": 1
                },
                "otherEnd": false
            },
            "train": "0JseDNqbID"
        },
        {
            "id": "_211FvBTf",
            "circle": {
                "x": -5,
                "y": 0,
                "z": 80,
                "r": 18.027756377319946
            },
            "type": "Station",
            "name": "Marblemoor"
        },
        {
            "id": "HuYTyuyPO",
            "circle": {
                "x": -5,
                "y": 0,
                "z": -80,
                "r": 18.027756377319946
            },
            "type": "Station",
            "name": "Oakbarrow"
        },
        {
            "id": "J76t_GwNQ",
            "type": "Route",
            "name": "S1",
            "detailedName": "Oakbarrow>>Marblemoor",
            "stops": [
                "bYYmkmu*q",
                "XUMZh02gd"
            ]
        },
        {
            "id": "XUMZh02gd",
            "type": "RouteStop",
            "station": "_211FvBTf",
            "platform": "IZDHoLy2u",
            "arrivalTime": 1800
        },
        {
            "id": "bYYmkmu*q",
            "type": "RouteStop",
            "station": "HuYTyuyPO",
            "platform": "7fvUb1erL",
            "departureTime": 0
        },
        {
            "id": "x9_zF0kKc",
            "type": "Trip",
            "route": "J76t_GwNQ",
            "departureTime": 0,
            "redefinedProps": {

            }
        }
    ],
    "camera": {
        "alpha": 0,
        "beta": 0.8000000000000002,
        "radius": 250.82265599999997,
        "target": {
            "x": -6.4724930737922135e-15,
            "y": 0,
            "z": -22.851916799999984
        },
        "position": {
            "x": 179.92916001719573,
            "y": 174.749827291476,
            "z": -22.851916799999984
        }
    },
    "_version": 1,
    "_format": "fahrplan",
    "target_passenger": 10
};
