export const SECOND_LEVEL = {
    "data": [
        {
            "id": "kdwxkhRXQ",
            "type": "TrackJoint",
            "ray": {
                "x": 20,
                "y": 0,
                "z": -90,
                "dirXZ": 0
            },
            "A": null,
            "B": {
                "track": "Z*bpEPaxnS",
                "whichEnd": "B"
            }
        },
        {
            "id": "JiwkBdpuC4",
            "type": "TrackJoint",
            "ray": {
                "x": 20,
                "y": 0,
                "z": 90,
                "dirXZ": 0
            },
            "A": {
                "track": "Z*bpEPaxnS",
                "whichEnd": "A"
            },
            "B": null
        },
        {
            "id": "Z*bpEPaxnS",
            "type": "Track",
            "segment": [
                {
                    "x": 20,
                    "y": 0,
                    "z": 90
                },
                {
                    "x": 20,
                    "y": 0,
                    "z": -90
                }
            ]
        },
        {
            "id": "0nw09OuaG",
            "type": "Platform",
            "track": "Z*bpEPaxnS",
            "start": 0.625,
            "end": 1,
            "side": "Right",
            "width": 7.5
        },
        {
            "id": "NnRSwQ3rc",
            "type": "Platform",
            "track": "Z*bpEPaxnS",
            "start": 0,
            "end": 0.375,
            "side": "Right",
            "width": 7.5
        },
        {
            "id": "YPrcZQ7ai",
            "type": "Wagon",
            "seatCount": 21,
            "seatColumns": 3,
            "seats": [

            ],
            "config": {
                "maxSpeed": 3,
                "accelerateBy": 0.25,
                "controlType": 1,
                "passengerArrangement": {
                    "seats": 3,
                    "rows": 7
                },
                "appearanceId": "vez",
                "length": 14,
                "connectable": {
                    "A": 0,
                    "B": 0
                }
            },
            "A": {
                "whichEnd": "A",
                "endOf": "YPrcZQ7ai",
                "positionOnTrack": {
                    "track": "Z*bpEPaxnS",
                    "position": 124.50000000001027,
                    "percentage": 0.6916666666667237,
                    "direction": 1
                },
                "otherEnd": false
            },
            "B": {
                "whichEnd": "B",
                "endOf": "YPrcZQ7ai",
                "positionOnTrack": {
                    "track": "Z*bpEPaxnS",
                    "position": 138.5000000000104,
                    "percentage": 0.7694444444445022,
                    "direction": 1
                },
                "otherEnd": {
                    "endOf": "hFMus_Xot",
                    "whichEnd": "A"
                }
            },
            "train": "jlx7RG3kp5"
        },
        {
            "id": "hFMus_Xot",
            "type": "Wagon",
            "seatCount": 21,
            "seatColumns": 3,
            "seats": [

            ],
            "config": {
                "maxSpeed": 3,
                "accelerateBy": 0.25,
                "controlType": 2,
                "passengerArrangement": {
                    "seats": 3,
                    "rows": 7
                },
                "appearanceId": "utas",
                "length": 14,
                "connectable": {
                    "A": 0,
                    "B": 0
                }
            },
            "A": {
                "whichEnd": "A",
                "endOf": "hFMus_Xot",
                "positionOnTrack": {
                    "track": "Z*bpEPaxnS",
                    "position": 139.5000000000104,
                    "percentage": 0.7750000000000579,
                    "direction": 1
                },
                "otherEnd": {
                    "endOf": "YPrcZQ7ai",
                    "whichEnd": "B"
                }
            },
            "B": {
                "whichEnd": "B",
                "endOf": "hFMus_Xot",
                "positionOnTrack": {
                    "track": "Z*bpEPaxnS",
                    "position": 153.5000000000104,
                    "percentage": 0.8527777777778356,
                    "direction": 1
                },
                "otherEnd": {
                    "endOf": "Vl6DBRIeN",
                    "whichEnd": "A"
                }
            },
            "train": "jlx7RG3kp5"
        },
        {
            "id": "Vl6DBRIeN",
            "type": "Wagon",
            "seatCount": 0,
            "seatColumns": 0,
            "seats": [

            ],
            "config": {
                "maxSpeed": 3,
                "accelerateBy": 0.25,
                "controlType": 0,
                "passengerArrangement": {
                    "seats": 0,
                    "rows": null
                },
                "appearanceId": "wagon",
                "length": 14,
                "connectable": {
                    "A": 0,
                    "B": 0
                }
            },
            "A": {
                "whichEnd": "A",
                "endOf": "Vl6DBRIeN",
                "positionOnTrack": {
                    "track": "Z*bpEPaxnS",
                    "position": 154.50000000001225,
                    "percentage": 0.8583333333334013,
                    "direction": 1
                },
                "otherEnd": {
                    "endOf": "hFMus_Xot",
                    "whichEnd": "B"
                }
            },
            "B": {
                "whichEnd": "B",
                "endOf": "Vl6DBRIeN",
                "positionOnTrack": {
                    "track": "Z*bpEPaxnS",
                    "position": 168.50000000001225,
                    "percentage": 0.9361111111111792,
                    "direction": 1
                },
                "otherEnd": false
            },
            "train": "jlx7RG3kp5"
        },
        {
            "id": "sx8tX7k0v",
            "circle": {
                "x": 15,
                "y": 0,
                "z": -55,
                "r": 41.23105625617661
            },
            "type": "Station",
            "name": "Northhurst"
        },
        {
            "id": "S3a4k_YlR",
            "circle": {
                "x": 15,
                "y": 0,
                "z": 55,
                "r": 41.23105625617661
            },
            "type": "Station",
            "name": "Edgemeadow"
        }
    ],
    "camera": {
        "alpha": 0,
        "beta": 0.8,
        "radius": 300.98718719999994,
        "target": {
            "x": -1.1505679213208955e-14,
            "y": 0,
            "z": -11.27824281599997
        },
        "position": {
            "x": 215.91499202063483,
            "y": 209.6997927497712,
            "z": -11.27824281599997
        }
    },
    "_version": 1,
    "_format": "fahrplan",
    "target_passenger": 30
};
