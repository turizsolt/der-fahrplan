export const SEVENTH_LEVEL = {
    "data": [
        {
            "id": "ZoOPOwINXD",
            "type": "Track",
            "segment": [
                {
                    "x": 0,
                    "y": 0,
                    "z": 110
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 130
                }
            ]
        },
        {
            "id": "EacBF0Bbn9",
            "type": "Track",
            "segment": [
                {
                    "x": 10,
                    "y": 0,
                    "z": 90
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 99.99999999999999
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 110
                }
            ]
        },
        {
            "id": "ubS2ouRT31",
            "type": "Track",
            "segment": [
                {
                    "x": 60,
                    "y": 0,
                    "z": 110
                },
                {
                    "x": 60,
                    "y": 0,
                    "z": 130
                }
            ]
        },
        {
            "id": "y_pZiHNEzx",
            "type": "Track",
            "segment": [
                {
                    "x": 50,
                    "y": 0,
                    "z": 90
                },
                {
                    "x": 60,
                    "y": 0,
                    "z": 99.99999999999999
                },
                {
                    "x": 60,
                    "y": 0,
                    "z": 110
                }
            ]
        },
        {
            "id": "vYb1RBL0fZ",
            "type": "Track",
            "segment": [
                {
                    "x": 40,
                    "y": 0,
                    "z": 80
                },
                {
                    "x": 50,
                    "y": 0,
                    "z": 90
                }
            ]
        },
        {
            "id": "zQflG4MAen",
            "type": "Track",
            "segment": [
                {
                    "x": 20,
                    "y": 0,
                    "z": 80
                },
                {
                    "x": 10,
                    "y": 0,
                    "z": 90
                }
            ]
        },
        {
            "id": "0eFi1imQhP",
            "type": "Track",
            "segment": [
                {
                    "x": 30,
                    "y": 0,
                    "z": 0
                },
                {
                    "x": 30,
                    "y": 0,
                    "z": 60
                }
            ]
        },
        {
            "id": "hNX5a_*4Zl",
            "type": "Track",
            "segment": [
                {
                    "x": 30,
                    "y": 0,
                    "z": -70
                },
                {
                    "x": 30,
                    "y": 0,
                    "z": -130
                }
            ]
        },
        {
            "id": "5SrpZYhp_",
            "type": "Track",
            "segment": [
                {
                    "x": 30,
                    "y": 0,
                    "z": 0
                },
                {
                    "x": 30,
                    "y": 0,
                    "z": -70
                }
            ]
        },
        {
            "id": "IIi_T0SIq",
            "type": "TrackSwitch",
            "segmentE": [
                {
                    "x": 30,
                    "y": 0,
                    "z": 60
                },
                {
                    "x": 30,
                    "y": 0,
                    "z": 70
                },
                {
                    "x": 20,
                    "y": 0,
                    "z": 80
                }
            ],
            "segmentF": [
                {
                    "x": 30,
                    "y": 0,
                    "z": 60
                },
                {
                    "x": 30,
                    "y": 0,
                    "z": 70
                },
                {
                    "x": 40,
                    "y": 0,
                    "z": 80
                }
            ]
        },
        {
            "id": "M0QCZCWuR",
            "type": "TrackJoint",
            "ray": {
                "x": 0,
                "y": 0,
                "z": 130,
                "dirXZ": 0
            },
            "A": {
                "track": "ZoOPOwINXD",
                "whichEnd": "B"
            },
            "B": null
        },
        {
            "id": "7stJwyX*S2",
            "type": "TrackJoint",
            "ray": {
                "x": 0,
                "y": 0,
                "z": 110,
                "dirXZ": 0
            },
            "A": {
                "track": "EacBF0Bbn9",
                "whichEnd": "B"
            },
            "B": {
                "track": "ZoOPOwINXD",
                "whichEnd": "A"
            }
        },
        {
            "id": "Ng0Cz*RBe",
            "type": "TrackJoint",
            "ray": {
                "x": 10,
                "y": 0,
                "z": 90,
                "dirXZ": 2.356194490192345
            },
            "A": {
                "track": "EacBF0Bbn9",
                "whichEnd": "A"
            },
            "B": {
                "track": "zQflG4MAen",
                "whichEnd": "B"
            }
        },
        {
            "id": "3w_YHVlMi",
            "type": "TrackJoint",
            "ray": {
                "x": 60,
                "y": 0,
                "z": 130,
                "dirXZ": 3.141592653589793
            },
            "A": null,
            "B": {
                "track": "ubS2ouRT31",
                "whichEnd": "B"
            }
        },
        {
            "id": "MWM8Tqepfo",
            "type": "TrackJoint",
            "ray": {
                "x": 60,
                "y": 0,
                "z": 110,
                "dirXZ": 3.141592653589793
            },
            "A": {
                "track": "ubS2ouRT31",
                "whichEnd": "A"
            },
            "B": {
                "track": "y_pZiHNEzx",
                "whichEnd": "B"
            }
        },
        {
            "id": "J7xzIiCuy",
            "type": "TrackJoint",
            "ray": {
                "x": 50,
                "y": 0,
                "z": 90,
                "dirXZ": -2.356194490192345
            },
            "A": {
                "track": "y_pZiHNEzx",
                "whichEnd": "A"
            },
            "B": {
                "track": "vYb1RBL0fZ",
                "whichEnd": "B"
            }
        },
        {
            "id": "ZvIdVTFCg",
            "type": "TrackJoint",
            "ray": {
                "x": 40,
                "y": 0,
                "z": 80,
                "dirXZ": -2.356194490192345
            },
            "A": {
                "track": "vYb1RBL0fZ",
                "whichEnd": "A"
            },
            "B": {
                "track": "IIi_T0SIq",
                "whichEnd": "E"
            }
        },
        {
            "id": "h0TGWwLOi",
            "type": "TrackJoint",
            "ray": {
                "x": 20,
                "y": 0,
                "z": 80,
                "dirXZ": -0.7853981633974483
            },
            "A": {
                "track": "IIi_T0SIq",
                "whichEnd": "F"
            },
            "B": {
                "track": "zQflG4MAen",
                "whichEnd": "A"
            }
        },
        {
            "id": "HjSmHNq1D",
            "type": "TrackJoint",
            "ray": {
                "x": 30,
                "y": 0,
                "z": 60,
                "dirXZ": 0
            },
            "A": {
                "track": "0eFi1imQhP",
                "whichEnd": "B"
            },
            "B": {
                "track": "IIi_T0SIq",
                "whichEnd": "A"
            }
        },
        {
            "id": "SDCHv3yY0",
            "type": "TrackJoint",
            "ray": {
                "x": 30,
                "y": 0,
                "z": 0,
                "dirXZ": 0
            },
            "A": {
                "track": "5SrpZYhp_",
                "whichEnd": "A"
            },
            "B": {
                "track": "0eFi1imQhP",
                "whichEnd": "A"
            }
        },
        {
            "id": "bn4Sec*uM",
            "type": "TrackJoint",
            "ray": {
                "x": 30,
                "y": 0,
                "z": -130,
                "dirXZ": 0
            },
            "A": null,
            "B": {
                "track": "hNX5a_*4Zl",
                "whichEnd": "B"
            }
        },
        {
            "id": "AUp0jiPa_E",
            "type": "TrackJoint",
            "ray": {
                "x": 30,
                "y": 0,
                "z": -70,
                "dirXZ": 0
            },
            "A": {
                "track": "hNX5a_*4Zl",
                "whichEnd": "A"
            },
            "B": {
                "track": "5SrpZYhp_",
                "whichEnd": "B"
            }
        },
        {
            "id": "mWFm5AlDe",
            "type": "Platform",
            "track": "ZoOPOwINXD",
            "start": 0,
            "end": 1,
            "side": "Left",
            "width": 7.5
        },
        {
            "id": "9RLo6iw0U",
            "type": "Platform",
            "track": "ubS2ouRT31",
            "start": 0,
            "end": 1,
            "side": "Right",
            "width": 7.5
        },
        {
            "id": "VzBonIjH*",
            "type": "Platform",
            "track": "0eFi1imQhP",
            "start": 0.125,
            "end": 0.875,
            "side": "Right",
            "width": 7.5
        },
        {
            "id": "sjToqm2qc",
            "type": "Platform",
            "track": "hNX5a_*4Zl",
            "start": 0.125,
            "end": 0.875,
            "side": "Left",
            "width": 7.5
        },
        {
            "id": "7tfbSyy8B",
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
                "endOf": "7tfbSyy8B",
                "positionOnTrack": {
                    "track": "hNX5a_*4Zl",
                    "position": 20.749999999999545,
                    "percentage": 0.3458333333333258,
                    "direction": 1
                },
                "otherEnd": false
            },
            "B": {
                "whichEnd": "B",
                "endOf": "7tfbSyy8B",
                "positionOnTrack": {
                    "track": "hNX5a_*4Zl",
                    "position": 34.749999999999545,
                    "percentage": 0.5791666666666591,
                    "direction": 1
                },
                "otherEnd": false
            },
            "train": "Fel7F8*wz9"
        },
        {
            "id": "NzLG6cPeh",
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
                "endOf": "NzLG6cPeh",
                "positionOnTrack": {
                    "track": "hNX5a_*4Zl",
                    "position": 39.5,
                    "percentage": 0.6583333333333333,
                    "direction": 1
                },
                "otherEnd": false
            },
            "B": {
                "whichEnd": "B",
                "endOf": "NzLG6cPeh",
                "positionOnTrack": {
                    "track": "hNX5a_*4Zl",
                    "position": 53.5,
                    "percentage": 0.8916666666666667,
                    "direction": 1
                },
                "otherEnd": false
            },
            "train": "Ek*xWa_ND"
        },
        {
            "id": "*T4TwY8BK",
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
                "endOf": "*T4TwY8BK",
                "positionOnTrack": {
                    "track": "hNX5a_*4Zl",
                    "position": 3,
                    "percentage": 0.05,
                    "direction": 1
                },
                "otherEnd": false
            },
            "B": {
                "whichEnd": "B",
                "endOf": "*T4TwY8BK",
                "positionOnTrack": {
                    "track": "hNX5a_*4Zl",
                    "position": 17,
                    "percentage": 0.28333333333333333,
                    "direction": 1
                },
                "otherEnd": false
            },
            "train": "hnzMV89PjL"
        },
        {
            "id": "q_rdexGd8",
            "circle": {
                "x": -5,
                "y": 0,
                "z": 120,
                "r": 18.027756377319946
            },
            "type": "Station",
            "name": "Aelcoast"
        },
        {
            "id": "jhgGuwePV",
            "circle": {
                "x": 65,
                "y": 0,
                "z": 120,
                "r": 18.027756377319946
            },
            "type": "Station",
            "name": "Northhurst"
        },
        {
            "id": "2ietSAllv",
            "circle": {
                "x": 30,
                "y": 0,
                "z": -100,
                "r": 31.622776601683793
            },
            "type": "Station",
            "name": "Hedgebeach"
        },
        {
            "id": "xjNZR9ooa",
            "circle": {
                "x": 30,
                "y": 0,
                "z": 30,
                "r": 31.622776601683793
            },
            "type": "Station",
            "name": "Deepsage"
        }
    ],
    "camera": {
        "alpha": 0,
        "beta": 0.7999999999999994,
        "radius": 209.01887999999988,
        "target": {
            "x": 56.704577274880066,
            "y": 0,
            "z": -16.948810240000043
        },
        "position": {
            "x": 206.64554395587635,
            "y": 145.62485607623006,
            "z": -16.948810240000043
        }
    },
    "_version": 1,
    "_format": "fahrplan",
    "target_passenger": 100
};
