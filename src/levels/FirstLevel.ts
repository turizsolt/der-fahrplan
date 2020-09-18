export const FIRST_LEVEL = {
  data: [
    {
      id: 'nlqnQxayP',
      type: 'TrackJoint',
      ray: { x: -10, y: 0, z: 5, dirXZ: 0 },
      A: null,
      B: { track: 'I*_HisyxV_', whichEnd: 'B' }
    },
    {
      id: 'x_V6aidT53',
      type: 'TrackJoint',
      ray: { x: -10, y: 0, z: 75, dirXZ: 0 },
      A: { track: 'I*_HisyxV_', whichEnd: 'A' },
      B: null
    },
    {
      id: 'I*_HisyxV_',
      type: 'Track',
      segment: [{ x: -10, y: 0, z: 75 }, { x: -10, y: 0, z: 5 }]
    },
    {
      id: 'W23_0EtKL',
      circle: { x: -15, y: 0, z: 20, r: 15 },
      type: 'Station',
      name: 'Aelcoast'
    },
    {
      id: '*ap0xjNun',
      circle: { x: -15, y: 0, z: 60, r: 15 },
      type: 'Station',
      name: 'Oakbarrow'
    },
    {
      id: 'Mglj_usJe',
      type: 'Platform',
      track: 'I*_HisyxV_',
      start: 0.625,
      end: 0.875,
      side: 'Right',
      width: 7.5
    },
    {
      id: 'XRByNvr43',
      type: 'Platform',
      track: 'I*_HisyxV_',
      start: 0.125,
      end: 0.375,
      side: 'Right',
      width: 7.5
    },
    {
      id: 'A2nPdwsy8',
      type: 'Wagon',
      seatCount: 21,
      seatColumns: 3,
      seats: [],
      A: {
        whichEnd: 'A',
        endOf: 'A2nPdwsy8',
        positionOnTrack: {
          track: 'I*_HisyxV_',
          position: 45,
          percentage: 0.6428571428571429,
          direction: 1
        },
        otherEnd: false
      },
      B: {
        whichEnd: 'B',
        endOf: 'A2nPdwsy8',
        positionOnTrack: {
          track: 'I*_HisyxV_',
          position: 59,
          percentage: 0.8428571428571429,
          direction: 1
        },
        otherEnd: false
      },
      trip: null,
      train: 'RRaeHFfiMH'
    },
    {
      id: 'RRaeHFfiMH',
      type: 'Train',
      wagons: ['A2nPdwsy8'],
      schedulingWagon: 'A2nPdwsy8'
    },
    {
      id: 'mFEeGSi7D',
      type: 'Route',
      name: '1',
      stops: ['lIF4xyOGE', 'jcXLbpcdJ'],
      reverse: 'kTZFipKmw'
    },
    {
      id: 'lIF4xyOGE',
      type: 'RouteStop',
      station: 'W23_0EtKL',
      platform: 'Mglj_usJe'
    },
    {
      id: 'jcXLbpcdJ',
      type: 'RouteStop',
      station: '*ap0xjNun',
      platform: 'XRByNvr43'
    },
    {
      id: 'kTZFipKmw',
      type: 'Route',
      name: '1',
      stops: ['KmIltK66Cv', '9O3lK9M*gN'],
      reverse: 'mFEeGSi7D'
    },
    {
      id: 'KmIltK66Cv',
      type: 'RouteStop',
      station: '*ap0xjNun',
      platform: 'XRByNvr43'
    },
    {
      id: '9O3lK9M*gN',
      type: 'RouteStop',
      station: 'W23_0EtKL',
      platform: 'Mglj_usJe'
    }
  ],
  _version: 1,
  _format: 'fahrplan'
};
