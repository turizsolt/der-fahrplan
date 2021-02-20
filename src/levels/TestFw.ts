export const TestFw = {
  data: [
    {
      id: 'N4mC_nTH9',
      type: 'TrackJoint',
      ray: { x: -10, y: 0, z: 10, dirXZ: 0 },
      A: null,
      B: { track: 'yKIEnpoofM', whichEnd: 'A' }
    },
    {
      id: 'KhlZbRGyKy',
      type: 'TrackJoint',
      ray: { x: -10, y: 0, z: 30, dirXZ: 0 },
      A: { track: 'yKIEnpoofM', whichEnd: 'F' },
      B: null
    },
    {
      id: 'nBrBAeJR_',
      type: 'TrackJoint',
      ray: { x: 0, y: 0, z: 30, dirXZ: 0.7853981633974483 },
      A: { track: 'yKIEnpoofM', whichEnd: 'E' },
      B: null
    },
    {
      id: 'yKIEnpoofM',
      type: 'TrackSwitch',
      segmentE: [{ x: -10, y: 0, z: 10 }, { x: -10, y: 0, z: 30 }],
      segmentF: [
        { x: -10, y: 0, z: 10 },
        { x: -10, y: 0, z: 20 },
        { x: 0, y: 0, z: 30 }
      ]
    }
  ],
  camera: {
    alpha: 0,
    beta: 0.8,
    radius: 70,
    target: { x: 0, y: 0, z: 30 },
    position: { x: 50.214926362966594, y: 48.769469654301574, z: 30 }
  },
  _version: 1,
  _format: 'fahrplan',
  actions: [
    {
      type: 'statement',
      object: 'yKIEnpoofM',
      function: 'switch',
      params: []
    },
    {
      type: 'statement',
      object: 'yKIEnpoofM',
      function: 'switch',
      params: []
    },
    {
      type: 'assertion',
      object: 'yKIEnpoofM',
      function: 'isEmpty',
      params: [],
      equalsTo: true
    }
  ]
};
