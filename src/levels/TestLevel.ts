export const TEST_LEVEL = { "data": [{ "id": "lckYtge8u", "type": "TrackJoint", "ray": { "x": 0, "y": 0, "z": 70, "dirXZ": 0 }, "A": { "track": "jM9_8lxGwv", "whichEnd": "B" }, "B": null }, { "id": "Aab9V9wq9Z", "type": "TrackJoint", "ray": { "x": 0, "y": 0, "z": 10, "dirXZ": 0 }, "A": null, "B": { "track": "jM9_8lxGwv", "whichEnd": "A" } }, { "id": "jM9_8lxGwv", "type": "Track", "segment": [{ "x": 0, "y": 0, "z": 10 }, { "x": 0, "y": 0, "z": 70 }] }, { "id": "EqLkyRDJF", "type": "Wagon", "seatCount": 21, "seatColumns": 3, "seats": [], "config": { "maxSpeed": 3, "accelerateBy": 0.25, "controlType": 0, "passengerArrangement": { "seats": 3, "rows": 7 }, "appearanceId": "mot", "length": 14, "connectable": { "A": 0, "B": 0 } }, "A": { "whichEnd": "A", "endOf": "EqLkyRDJF", "positionOnTrack": { "track": "jM9_8lxGwv", "position": 41.74999999999662, "percentage": 0.695833333333277, "direction": 1 }, "otherEnd": false }, "B": { "whichEnd": "B", "endOf": "EqLkyRDJF", "positionOnTrack": { "track": "jM9_8lxGwv", "position": 55.749999999996625, "percentage": 0.9291666666666104, "direction": 1 }, "otherEnd": false }, "train": "vZeWTD3iDB" }, { "id": "vZeWTD3iDB", "type": "Train", "wagons": [{ "side": "A", "wagon": "EqLkyRDJF" }] }, { "id": "YXFxj9kA9", "type": "Platform", "track": "jM9_8lxGwv", "start": 0.75, "end": 0.875, "side": "Right", "width": 7.5 }, { "id": "9K*j_01KS", "type": "Platform", "track": "jM9_8lxGwv", "start": 0.125, "end": 0.25, "side": "Right", "width": 7.5 }, { "id": "zwvnZuGF*", "circle": { "x": 0, "y": 0, "z": 60, "r": 11.180339887498949 }, "type": "Station", "name": "Westmeadow" }, { "id": "Kdt91oqpJ", "circle": { "x": 0, "y": 0, "z": 20, "r": 14.142135623730951 }, "type": "Station", "name": "Clearcrest" }, { "id": "BSHhjSAtC", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "AVb8gX5*I", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "dEvgDRX2s", "type": "Route", "name": "1", "detailedName": "Westmeadow>>Clearcrest", "stops": ["evdpZzkvu", "jWcHTzVnZ_"] }, { "id": "SYKFroj81", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "8F4YXmb*V", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "l6dw0wKQT", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "bdaU1dcqH", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "K2OFstk11", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "w4PYfzotZ", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "evdpZzkvu", "type": "RouteStop", "station": "zwvnZuGF*", "platform": "YXFxj9kA9" }, { "id": "iLkFt_GAS", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "jWcHTzVnZ_", "type": "RouteStop", "station": "Kdt91oqpJ", "platform": "9K*j_01KS" }, { "id": "Ba29B_JQ7", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "yHJ4dWbW5", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "DKB8gN*Rk", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "c*m_3rzRq", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "98F1buAu1", "type": "Trip", "route": "dEvgDRX2s", "departureTime": 3600, "redefinedProps": {} }, { "id": "m96ZPdWCQ", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "EK9rsX4mt", "type": "Route", "name": "1V", "detailedName": "Clearcrest>>Westmeadow", "stops": ["k50k*NT0_P", "uNrXY7kcG1"] }, { "id": "k50k*NT0_P", "type": "RouteStop", "station": "Kdt91oqpJ", "platform": "9K*j_01KS" }, { "id": "uNrXY7kcG1", "type": "RouteStop", "station": "zwvnZuGF*", "platform": "YXFxj9kA9" }, { "id": "jjUuT7uxFX", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "tNr6IGuGT", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "*qAGSOosV", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "HY2XyaxVe", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "tEXN6uHV1", "type": "Trip", "route": "EK9rsX4mt", "departureTime": 7200, "redefinedProps": {} }, { "id": "f9xpIJLDm", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "0EgK1kUsg", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "cgwffSwYW", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "E4yl1fyNa", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "9nJv9TUtY", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "cKW0RwHk8", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "_4lX*Aizb", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "VXasBJXGX", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "yQ4J5vOvL", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "wOKQrVqSW", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "mN36e9lZz", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "Aap5wC679", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "Sx93kDmL0", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "pgAIBdj08", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "iRddWbR_t", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "CPaCGIDPo", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "XXLFkyYPE", "type": "Passenger", "from": "Kdt91oqpJ", "to": "zwvnZuGF*", "place": "Kdt91oqpJ" }, { "id": "zQWgz0CXW", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }, { "id": "BUNby5s97", "type": "Passenger", "from": "zwvnZuGF*", "to": "Kdt91oqpJ", "place": "zwvnZuGF*" }], "camera": { "alpha": 0, "beta": 0.8, "radius": 70, "target": { "x": 0, "y": 0, "z": 30 }, "position": { "x": 50.214926362966594, "y": 48.769469654301574, "z": 30 } }, "_version": 1, "_format": "fahrplan" }