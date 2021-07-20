export const DEMO_TWO_TRACKS = {
  data: [
    {
      id: 'hS1g7kyNn',
      circle: {
        x: 5,
        y: 0,
        z: -120,
        r: 39.05124837953327
      },
      type: 'Station',
      name: 'Pondley'
    },
    {
      id: 'rWN0HLuNc',
      circle: {
        x: -30,
        y: 0,
        z: 90,
        r: 21.213203435596427
      },
      type: 'Station',
      name: 'Northhurst'
    },
    {
      id: 'oFjCo5ZHD',
      circle: {
        x: 110,
        y: 0,
        z: 50,
        r: 21.213203435596427
      },
      type: 'Station',
      name: 'Treefort'
    },
    {
      id: 'aJ2GpnXMV',
      circle: {
        x: 105,
        y: 0,
        z: -70,
        r: 18.027756377319946
      },
      type: 'Station',
      name: 'Violetham'
    },
    {
      id: 'YIOgjxfsB',
      type: 'RouteStop',
      station: 'hS1g7kyNn',
      departureTime: 0
    },
    {
      id: '3Vvm*DGOid',
      type: 'RouteStop',
      station: 'rWN0HLuNc',
      departureTime: 300
    },
    {
      id: '6JgHLSOTC',
      type: 'RouteStop',
      station: 'oFjCo5ZHD',
      departureTime: 600
    },
    {
      id: 'PnDVI9aJOv',
      type: 'RouteStop',
      station: 'aJ2GpnXMV',
      arrivalTime: 900
    },
    {
      id: 'UJ3R5ZvUV6',
      type: 'RouteStop',
      station: 'aJ2GpnXMV',
      departureTime: 0
    },
    {
      id: '*ol5N1K9TC',
      type: 'RouteStop',
      station: 'oFjCo5ZHD',
      departureTime: 300
    },
    {
      id: 'Qn6F5b7eyV',
      type: 'RouteStop',
      station: 'rWN0HLuNc',
      departureTime: 600
    },
    {
      id: 'lLIsIy8ya2',
      type: 'RouteStop',
      station: 'hS1g7kyNn',
      arrivalTime: 900
    },
    {
      id: 'RbbqWpLDY',
      type: 'Route',
      name: '1',
      detailedName: 'Pondley>>Violetham',
      stops: ['YIOgjxfsB', '3Vvm*DGOid', '6JgHLSOTC', 'PnDVI9aJOv']
    },
    {
      id: '9AJKvWR3C',
      type: 'Route',
      name: '1V',
      detailedName: 'Violetham>>Pondley',
      stops: ['UJ3R5ZvUV6', '*ol5N1K9TC', 'Qn6F5b7eyV', 'lLIsIy8ya2']
    },
    {
      id: 'P*f6pIicn',
      type: 'Trip',
      route: 'RbbqWpLDY',
      departureTime: 0,
      prevTrip: 'wPXVLIiOD',
      nextTrip: 'wPXVLIiOD',
      redefinedProps: {}
    },
    {
      id: 'wPXVLIiOD',
      type: 'Trip',
      route: '9AJKvWR3C',
      departureTime: 0,
      prevTrip: 'P*f6pIicn',
      nextTrip: 'P*f6pIicn',
      redefinedProps: {}
    },
    {
      id: 'PupD3DdfE',
      type: 'Trip',
      route: 'RbbqWpLDY',
      departureTime: 300,
      prevTrip: 'xiGiFKlpV',
      nextTrip: 'xiGiFKlpV',
      redefinedProps: {}
    },
    {
      id: 'hNcfFKjol',
      type: 'Trip',
      route: 'RbbqWpLDY',
      departureTime: 600,
      prevTrip: 'wP7teOyJd',
      nextTrip: 'wP7teOyJd',
      redefinedProps: {}
    },
    {
      id: 'uOycLYlcU',
      type: 'Trip',
      route: 'RbbqWpLDY',
      departureTime: 900,
      prevTrip: '29qcDlWxu',
      nextTrip: '29qcDlWxu',
      redefinedProps: {}
    },
    {
      id: 'xiGiFKlpV',
      type: 'Trip',
      route: '9AJKvWR3C',
      departureTime: 300,
      prevTrip: 'PupD3DdfE',
      nextTrip: 'PupD3DdfE',
      redefinedProps: {}
    },
    {
      id: 'wP7teOyJd',
      type: 'Trip',
      route: '9AJKvWR3C',
      departureTime: 600,
      prevTrip: 'hNcfFKjol',
      nextTrip: 'hNcfFKjol',
      redefinedProps: {}
    },
    {
      id: '29qcDlWxu',
      type: 'Trip',
      route: '9AJKvWR3C',
      departureTime: 900,
      prevTrip: 'uOycLYlcU',
      nextTrip: 'uOycLYlcU',
      redefinedProps: {}
    },
    {
      id: 'VesPfR2ti0',
      type: 'TrackJoint',
      ray: {
        x: 10,
        y: 0,
        z: -140,
        dirXZ: 0
      }
    },
    {
      id: 'h0uqas_cTx',
      type: 'TrackJoint',
      ray: {
        x: 10,
        y: 0,
        z: -100,
        dirXZ: 0
      }
    },
    {
      id: 'JkzjxRgSnH',
      type: 'TrackJoint',
      ray: {
        x: 0,
        y: 0,
        z: -140,
        dirXZ: 0
      }
    },
    {
      id: 'FQx0Bw5R*r',
      type: 'TrackJoint',
      ray: {
        x: 0,
        y: 0,
        z: -100,
        dirXZ: 0
      }
    },
    {
      id: '9jXiBJe8nj',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: -140,
        dirXZ: 0
      }
    },
    {
      id: 'k9sMyWhrwG',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: -100,
        dirXZ: 0
      }
    },
    {
      id: 'tnTySrO9La',
      type: 'TrackJoint',
      ray: {
        x: 30,
        y: 0,
        z: -140,
        dirXZ: 0
      }
    },
    {
      id: 'QaJQiqQR1L',
      type: 'TrackJoint',
      ray: {
        x: 30,
        y: 0,
        z: -100,
        dirXZ: 0
      }
    },
    {
      id: 'unl_P5Cksy',
      type: 'TrackJoint',
      ray: {
        x: 20,
        y: 0,
        z: -80,
        dirXZ: 2.356194490192345
      }
    },
    {
      id: 'O32GWZlS4d',
      type: 'TrackJoint',
      ray: {
        x: 10,
        y: 0,
        z: -80,
        dirXZ: 0
      }
    },
    {
      id: 'NrhmXyUpJm',
      type: 'TrackJoint',
      ray: {
        x: 0,
        y: 0,
        z: -80,
        dirXZ: 0
      }
    },
    {
      id: 'dPo1TCXqbr',
      type: 'TrackJoint',
      ray: {
        x: -10,
        y: 0,
        z: -80,
        dirXZ: 0.7853981633974483
      }
    },
    {
      id: 'zi6KE55q_9',
      type: 'TrackJoint',
      ray: {
        x: 10,
        y: 0,
        z: -60,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: '5*Jo03Jw*r',
      type: 'TrackJoint',
      ray: {
        x: 0,
        y: 0,
        z: -60,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'vggftDVA2P',
      type: 'TrackJoint',
      ray: {
        x: -10,
        y: 0,
        z: -30,
        dirXZ: -0.7853981633974483
      }
    },
    {
      id: 'sfRWa*jkrf',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: -10,
        dirXZ: 0
      }
    },
    {
      id: 'wk*8CCDdGL',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: 10,
        dirXZ: 0
      }
    },
    {
      id: 'wCI3iIk_Vp',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: 30,
        dirXZ: 0
      }
    },
    {
      id: 'oaPGMjsXqK',
      type: 'TrackJoint',
      ray: {
        x: -30,
        y: 0,
        z: 50,
        dirXZ: 2.356194490192345
      }
    },
    {
      id: 'P9d7Kd3rzm',
      type: 'TrackJoint',
      ray: {
        x: -40,
        y: 0,
        z: 70,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'THps9D6fsq',
      type: 'TrackJoint',
      ray: {
        x: -40,
        y: 0,
        z: 110,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'ThEkDQTPOV',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: 50,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'Ku9sJ8KBU6',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: 70,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'gP2fN8J30X',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: 110,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'cBS1xtrttO',
      type: 'TrackJoint',
      ray: {
        x: -30,
        y: 0,
        z: 130,
        dirXZ: -2.356194490192345
      }
    },
    {
      id: 'F6bNJqgYj8',
      type: 'TrackJoint',
      ray: {
        x: -10,
        y: 0,
        z: 140,
        dirXZ: -1.5707963267948966
      }
    },
    {
      id: '0yDi858Mau',
      type: 'TrackJoint',
      ray: {
        x: -10,
        y: 0,
        z: 130,
        dirXZ: 0.7853981633974483
      }
    },
    {
      id: 'DeLxt2vZIH',
      type: 'TrackJoint',
      ray: {
        x: 10,
        y: 0,
        z: 140,
        dirXZ: 1.5707963267948966
      }
    },
    {
      id: 'O5*SBjMXI8',
      type: 'TrackJoint',
      ray: {
        x: 30,
        y: 0,
        z: 140,
        dirXZ: 1.5707963267948966
      }
    },
    {
      id: 'Ink9vwzAeR',
      type: 'TrackJoint',
      ray: {
        x: 50,
        y: 0,
        z: 140,
        dirXZ: 1.5707963267948966
      }
    },
    {
      id: 'UcQH9BkzvD',
      type: 'TrackJoint',
      ray: {
        x: 70,
        y: 0,
        z: 140,
        dirXZ: 1.5707963267948966
      }
    },
    {
      id: '1UphS5ymFu',
      type: 'TrackJoint',
      ray: {
        x: 90,
        y: 0,
        z: 140,
        dirXZ: 1.5707963267948966
      }
    },
    {
      id: 'x4BVwiOcZK',
      type: 'TrackJoint',
      ray: {
        x: 110,
        y: 0,
        z: 130,
        dirXZ: 2.356194490192345
      }
    },
    {
      id: 'Yp2sWBDx2O',
      type: 'TrackJoint',
      ray: {
        x: 120,
        y: 0,
        z: 110,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'LRwzuFRVvi',
      type: 'TrackJoint',
      ray: {
        x: 120,
        y: 0,
        z: 90,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'jQbDW7dhV',
      type: 'TrackJoint',
      ray: {
        x: 110,
        y: 0,
        z: 90,
        dirXZ: -2.356194490192345
      }
    },
    {
      id: 'Z7f4neoDVn',
      type: 'TrackJoint',
      ray: {
        x: 100,
        y: 0,
        z: 70,
        dirXZ: 0
      }
    },
    {
      id: '9KDiD9YsEf',
      type: 'TrackJoint',
      ray: {
        x: 100,
        y: 0,
        z: 30,
        dirXZ: 0
      }
    },
    {
      id: 'o_yrEu_avR',
      type: 'TrackJoint',
      ray: {
        x: 120,
        y: 0,
        z: 70,
        dirXZ: 0
      }
    },
    {
      id: 'S_FrkVDBp9',
      type: 'TrackJoint',
      ray: {
        x: 120,
        y: 0,
        z: 30,
        dirXZ: 0
      }
    },
    {
      id: 'cUIGoqZbih',
      type: 'TrackJoint',
      ray: {
        x: 110,
        y: 0,
        z: 10,
        dirXZ: 0.7853981633974483
      }
    },
    {
      id: 'zghtjBmL3e',
      type: 'TrackJoint',
      ray: {
        x: 100,
        y: 0,
        z: -10,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'RP1ZFPK561',
      type: 'TrackJoint',
      ray: {
        x: 100,
        y: 0,
        z: 10,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'a6_LHOTf9h',
      type: 'TrackJoint',
      ray: {
        x: 100,
        y: 0,
        z: -30,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: '2INtkkY9KL',
      type: 'TrackJoint',
      ray: {
        x: 100,
        y: 0,
        z: -50,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'K6kp2nmADj',
      type: 'TrackJoint',
      ray: {
        x: 100,
        y: 0,
        z: -90,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: '5dYWK2K308',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'VesPfR2ti0'
        },
        endJointEnd: {
          end: 'A',
          joint: 'h0uqas_cTx'
        },
        coordinates: [
          {
            x: 10,
            y: 0,
            z: -140
          },
          {
            x: 10,
            y: 0,
            z: -100
          }
        ]
      }
    },
    {
      id: 'mjbjKS18CB',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'JkzjxRgSnH'
        },
        endJointEnd: {
          end: 'A',
          joint: 'FQx0Bw5R*r'
        },
        coordinates: [
          {
            x: 0,
            y: 0,
            z: -140
          },
          {
            x: 0,
            y: 0,
            z: -100
          }
        ]
      }
    },
    {
      id: 'tYnNTUUbl1',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: '9jXiBJe8nj'
        },
        endJointEnd: {
          end: 'A',
          joint: 'k9sMyWhrwG'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: -140
          },
          {
            x: -20,
            y: 0,
            z: -100
          }
        ]
      }
    },
    {
      id: '5NRfqzqajW',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'tnTySrO9La'
        },
        endJointEnd: {
          end: 'A',
          joint: 'QaJQiqQR1L'
        },
        coordinates: [
          {
            x: 30,
            y: 0,
            z: -140
          },
          {
            x: 30,
            y: 0,
            z: -100
          }
        ]
      }
    },
    {
      id: '652lnQOGka',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'QaJQiqQR1L'
        },
        endJointEnd: {
          end: 'B',
          joint: 'unl_P5Cksy'
        },
        coordinates: [
          {
            x: 30,
            y: 0,
            z: -100
          },
          {
            x: 30,
            y: 0,
            z: -90
          },
          {
            x: 20,
            y: 0,
            z: -80
          }
        ]
      }
    },
    {
      id: 'BP*v9PfQrw',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'h0uqas_cTx'
        },
        endJointEnd: {
          end: 'A',
          joint: 'O32GWZlS4d'
        },
        coordinates: [
          {
            x: 10,
            y: 0,
            z: -100
          },
          {
            x: 10,
            y: 0,
            z: -80
          }
        ]
      }
    },
    {
      id: 'Cb21H5BwOK',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'FQx0Bw5R*r'
        },
        endJointEnd: {
          end: 'A',
          joint: 'NrhmXyUpJm'
        },
        coordinates: [
          {
            x: 0,
            y: 0,
            z: -100
          },
          {
            x: 0,
            y: 0,
            z: -80
          }
        ]
      }
    },
    {
      id: 'Q24Vnk6Wak',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'k9sMyWhrwG'
        },
        endJointEnd: {
          end: 'A',
          joint: 'dPo1TCXqbr'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: -100
          },
          {
            x: -20,
            y: 0,
            z: -90
          },
          {
            x: -10,
            y: 0,
            z: -80
          }
        ]
      }
    },
    {
      id: 'euZWN5I34S',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'vggftDVA2P'
        },
        endJointEnd: {
          end: 'A',
          joint: 'sfRWa*jkrf'
        },
        coordinates: [
          {
            x: -10,
            y: 0,
            z: -30
          },
          {
            x: -20,
            y: 0,
            z: -20.000000000000004
          },
          {
            x: -20,
            y: 0,
            z: -10
          }
        ]
      }
    },
    {
      id: 'FzcX2v_vz4',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'sfRWa*jkrf'
        },
        endJointEnd: {
          end: 'A',
          joint: 'wk*8CCDdGL'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: -10
          },
          {
            x: -20,
            y: 0,
            z: 10
          }
        ]
      }
    },
    {
      id: 'e86W1EWH7x',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'wk*8CCDdGL'
        },
        endJointEnd: {
          end: 'A',
          joint: 'wCI3iIk_Vp'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: 10
          },
          {
            x: -20,
            y: 0,
            z: 30
          }
        ]
      }
    },
    {
      id: 'K4LnfjqsEM',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'oaPGMjsXqK'
        },
        endJointEnd: {
          end: 'B',
          joint: 'P9d7Kd3rzm'
        },
        coordinates: [
          {
            x: -30,
            y: 0,
            z: 50
          },
          {
            x: -40.00000000000001,
            y: 0,
            z: 60.00000000000001
          },
          {
            x: -40,
            y: 0,
            z: 70
          }
        ]
      }
    },
    {
      id: 'CXmHAihAP1',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'P9d7Kd3rzm'
        },
        endJointEnd: {
          end: 'B',
          joint: 'THps9D6fsq'
        },
        coordinates: [
          {
            x: -40,
            y: 0,
            z: 70
          },
          {
            x: -40,
            y: 0,
            z: 110
          }
        ]
      }
    },
    {
      id: 'oZSI*kEu3c',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'ThEkDQTPOV'
        },
        endJointEnd: {
          end: 'B',
          joint: 'Ku9sJ8KBU6'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: 50
          },
          {
            x: -20,
            y: 0,
            z: 70
          }
        ]
      }
    },
    {
      id: '9aPB*kbawF',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'Ku9sJ8KBU6'
        },
        endJointEnd: {
          end: 'B',
          joint: 'gP2fN8J30X'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: 70
          },
          {
            x: -20,
            y: 0,
            z: 110
          }
        ]
      }
    },
    {
      id: '3hTojeYNMT',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'THps9D6fsq'
        },
        endJointEnd: {
          end: 'B',
          joint: 'cBS1xtrttO'
        },
        coordinates: [
          {
            x: -40,
            y: 0,
            z: 110
          },
          {
            x: -40,
            y: 0,
            z: 119.99999999999999
          },
          {
            x: -30,
            y: 0,
            z: 130
          }
        ]
      }
    },
    {
      id: 'LDnPaGY3fx',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'cBS1xtrttO'
        },
        endJointEnd: {
          end: 'B',
          joint: 'F6bNJqgYj8'
        },
        coordinates: [
          {
            x: -30,
            y: 0,
            z: 130
          },
          {
            x: -20,
            y: 0,
            z: 140
          },
          {
            x: -10,
            y: 0,
            z: 140
          }
        ]
      }
    },
    {
      id: '01ZRRy0xph',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'gP2fN8J30X'
        },
        endJointEnd: {
          end: 'A',
          joint: '0yDi858Mau'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: 110
          },
          {
            x: -20,
            y: 0,
            z: 119.99999999999999
          },
          {
            x: -10,
            y: 0,
            z: 130
          }
        ]
      }
    },
    {
      id: 'IUlgO66hli',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'DeLxt2vZIH'
        },
        endJointEnd: {
          end: 'A',
          joint: 'O5*SBjMXI8'
        },
        coordinates: [
          {
            x: 10,
            y: 0,
            z: 140
          },
          {
            x: 30,
            y: 0,
            z: 140
          }
        ]
      }
    },
    {
      id: 'vipp_tMA0Z',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'O5*SBjMXI8'
        },
        endJointEnd: {
          end: 'A',
          joint: 'Ink9vwzAeR'
        },
        coordinates: [
          {
            x: 30,
            y: 0,
            z: 140
          },
          {
            x: 50,
            y: 0,
            z: 140
          }
        ]
      }
    },
    {
      id: 'IYWl3lzeAu',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'Ink9vwzAeR'
        },
        endJointEnd: {
          end: 'A',
          joint: 'UcQH9BkzvD'
        },
        coordinates: [
          {
            x: 50,
            y: 0,
            z: 140
          },
          {
            x: 70,
            y: 0,
            z: 140
          }
        ]
      }
    },
    {
      id: 'FYuVYbZDlv',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'UcQH9BkzvD'
        },
        endJointEnd: {
          end: 'A',
          joint: '1UphS5ymFu'
        },
        coordinates: [
          {
            x: 70,
            y: 0,
            z: 140
          },
          {
            x: 90,
            y: 0,
            z: 140
          }
        ]
      }
    },
    {
      id: 'SYbmrWY4MO',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: '1UphS5ymFu'
        },
        endJointEnd: {
          end: 'A',
          joint: 'x4BVwiOcZK'
        },
        coordinates: [
          {
            x: 90,
            y: 0,
            z: 140
          },
          {
            x: 100,
            y: 0,
            z: 140
          },
          {
            x: 110,
            y: 0,
            z: 130
          }
        ]
      }
    },
    {
      id: 'nt2*HCihkQ',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'x4BVwiOcZK'
        },
        endJointEnd: {
          end: 'A',
          joint: 'Yp2sWBDx2O'
        },
        coordinates: [
          {
            x: 110,
            y: 0,
            z: 130
          },
          {
            x: 119.99999999999999,
            y: 0,
            z: 120.00000000000001
          },
          {
            x: 120,
            y: 0,
            z: 110
          }
        ]
      }
    },
    {
      id: 'YctvefyM3f',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'jQbDW7dhV'
        },
        endJointEnd: {
          end: 'B',
          joint: 'Z7f4neoDVn'
        },
        coordinates: [
          {
            x: 110,
            y: 0,
            z: 90
          },
          {
            x: 100,
            y: 0,
            z: 80
          },
          {
            x: 100,
            y: 0,
            z: 70
          }
        ]
      }
    },
    {
      id: '4BELLPWgjt',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'Z7f4neoDVn'
        },
        endJointEnd: {
          end: 'B',
          joint: '9KDiD9YsEf'
        },
        coordinates: [
          {
            x: 100,
            y: 0,
            z: 70
          },
          {
            x: 100,
            y: 0,
            z: 30
          }
        ]
      }
    },
    {
      id: 'RjJQdOSaoM',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'LRwzuFRVvi'
        },
        endJointEnd: {
          end: 'B',
          joint: 'o_yrEu_avR'
        },
        coordinates: [
          {
            x: 120,
            y: 0,
            z: 90
          },
          {
            x: 120,
            y: 0,
            z: 70
          }
        ]
      }
    },
    {
      id: 'whVPO4MjB9',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'o_yrEu_avR'
        },
        endJointEnd: {
          end: 'B',
          joint: 'S_FrkVDBp9'
        },
        coordinates: [
          {
            x: 120,
            y: 0,
            z: 70
          },
          {
            x: 120,
            y: 0,
            z: 30
          }
        ]
      }
    },
    {
      id: 'EfODpYVvww',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'S_FrkVDBp9'
        },
        endJointEnd: {
          end: 'B',
          joint: 'cUIGoqZbih'
        },
        coordinates: [
          {
            x: 120,
            y: 0,
            z: 30
          },
          {
            x: 120,
            y: 0,
            z: 20.000000000000004
          },
          {
            x: 110,
            y: 0,
            z: 10
          }
        ]
      }
    },
    {
      id: 'MTNAZC79J',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'RP1ZFPK561'
        },
        endJointEnd: {
          end: 'A',
          joint: '9KDiD9YsEf'
        },
        coordinates: [
          {
            x: 100,
            y: 0,
            z: 10
          },
          {
            x: 100,
            y: 0,
            z: 30
          }
        ]
      }
    },
    {
      id: '_8MryH*RNL',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'zghtjBmL3e'
        },
        endJointEnd: {
          end: 'A',
          joint: 'a6_LHOTf9h'
        },
        coordinates: [
          {
            x: 100,
            y: 0,
            z: -10
          },
          {
            x: 100,
            y: 0,
            z: -30
          }
        ]
      }
    },
    {
      id: 'ARLSeYUlDn',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'a6_LHOTf9h'
        },
        endJointEnd: {
          end: 'A',
          joint: '2INtkkY9KL'
        },
        coordinates: [
          {
            x: 100,
            y: 0,
            z: -30
          },
          {
            x: 100,
            y: 0,
            z: -50
          }
        ]
      }
    },
    {
      id: 'M7Zhwz1a0h',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: '2INtkkY9KL'
        },
        endJointEnd: {
          end: 'A',
          joint: 'K6kp2nmADj'
        },
        coordinates: [
          {
            x: 100,
            y: 0,
            z: -50
          },
          {
            x: 100,
            y: 0,
            z: -90
          }
        ]
      }
    },
    {
      id: 'sdYrCPAej',
      type: 'TrackSwitch',
      segmentLeftData: {
        startJointEnd: {
          end: 'B',
          joint: 'zi6KE55q_9'
        },
        endJointEnd: {
          end: 'A',
          joint: 'unl_P5Cksy'
        },
        coordinates: [
          {
            x: 10,
            y: 0,
            z: -60
          },
          {
            x: 10.000000000000002,
            y: 0,
            z: -70
          },
          {
            x: 20,
            y: 0,
            z: -80
          }
        ]
      },
      segmentRightData: {
        startJointEnd: {
          end: 'B',
          joint: 'zi6KE55q_9'
        },
        endJointEnd: {
          end: 'B',
          joint: 'O32GWZlS4d'
        },
        coordinates: [
          {
            x: 10,
            y: 0,
            z: -60
          },
          {
            x: 10,
            y: 0,
            z: -80
          }
        ]
      },
      state: 0,
      isLocked: false
    },
    {
      id: '3ibBCT7Q2',
      type: 'TrackSwitch',
      segmentLeftData: {
        startJointEnd: {
          end: 'B',
          joint: '5*Jo03Jw*r'
        },
        endJointEnd: {
          end: 'B',
          joint: 'NrhmXyUpJm'
        },
        coordinates: [
          {
            x: 0,
            y: 0,
            z: -60
          },
          {
            x: 0,
            y: 0,
            z: -80
          }
        ]
      },
      segmentRightData: {
        startJointEnd: {
          end: 'B',
          joint: '5*Jo03Jw*r'
        },
        endJointEnd: {
          end: 'B',
          joint: 'dPo1TCXqbr'
        },
        coordinates: [
          {
            x: 0,
            y: 0,
            z: -60
          },
          {
            x: 1.224646799147353e-15,
            y: 0,
            z: -70
          },
          {
            x: -10,
            y: 0,
            z: -80
          }
        ]
      },
      state: 0,
      isLocked: false
    },
    {
      id: '*sIG07knu',
      type: 'TrackSwitch',
      segmentLeftData: {
        startJointEnd: {
          end: 'A',
          joint: 'vggftDVA2P'
        },
        endJointEnd: {
          end: 'A',
          joint: 'zi6KE55q_9'
        },
        coordinates: [
          {
            x: -10,
            y: 0,
            z: -30
          },
          {
            x: 9.999999999999998,
            y: 0,
            z: -50.00000000000001
          },
          {
            x: 10,
            y: 0,
            z: -60
          }
        ]
      },
      segmentRightData: {
        startJointEnd: {
          end: 'A',
          joint: 'vggftDVA2P'
        },
        endJointEnd: {
          end: 'A',
          joint: '5*Jo03Jw*r'
        },
        coordinates: [
          {
            x: -10,
            y: 0,
            z: -30
          },
          {
            x: -7.105427357601002e-15,
            y: 0,
            z: -40
          },
          {
            x: 0,
            y: 0,
            z: -60
          }
        ]
      },
      state: 0,
      isLocked: false
    },
    {
      id: 'P4F6b5KVgS',
      type: 'TrackSwitch',
      segmentLeftData: {
        startJointEnd: {
          end: 'B',
          joint: 'wCI3iIk_Vp'
        },
        endJointEnd: {
          end: 'B',
          joint: 'oaPGMjsXqK'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: 30
          },
          {
            x: -20,
            y: 0,
            z: 40.00000000000001
          },
          {
            x: -30,
            y: 0,
            z: 50
          }
        ]
      },
      segmentRightData: {
        startJointEnd: {
          end: 'B',
          joint: 'wCI3iIk_Vp'
        },
        endJointEnd: {
          end: 'B',
          joint: 'ThEkDQTPOV'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: 30
          },
          {
            x: -20,
            y: 0,
            z: 50
          }
        ]
      },
      state: 0,
      isLocked: false
    },
    {
      id: 'wCAQNNPXe',
      type: 'TrackSwitch',
      segmentLeftData: {
        startJointEnd: {
          end: 'A',
          joint: 'DeLxt2vZIH'
        },
        endJointEnd: {
          end: 'B',
          joint: '0yDi858Mau'
        },
        coordinates: [
          {
            x: 10,
            y: 0,
            z: 140
          },
          {
            x: 0,
            y: 0,
            z: 140
          },
          {
            x: -10,
            y: 0,
            z: 130
          }
        ]
      },
      segmentRightData: {
        startJointEnd: {
          end: 'A',
          joint: 'DeLxt2vZIH'
        },
        endJointEnd: {
          end: 'A',
          joint: 'F6bNJqgYj8'
        },
        coordinates: [
          {
            x: 10,
            y: 0,
            z: 140
          },
          {
            x: -10,
            y: 0,
            z: 140
          }
        ]
      },
      state: 0,
      isLocked: false
    },
    {
      id: '4groSRzIBL',
      type: 'TrackSwitch',
      segmentLeftData: {
        startJointEnd: {
          end: 'B',
          joint: 'Yp2sWBDx2O'
        },
        endJointEnd: {
          end: 'A',
          joint: 'LRwzuFRVvi'
        },
        coordinates: [
          {
            x: 120,
            y: 0,
            z: 110
          },
          {
            x: 120,
            y: 0,
            z: 90
          }
        ]
      },
      segmentRightData: {
        startJointEnd: {
          end: 'B',
          joint: 'Yp2sWBDx2O'
        },
        endJointEnd: {
          end: 'A',
          joint: 'jQbDW7dhV'
        },
        coordinates: [
          {
            x: 120,
            y: 0,
            z: 110
          },
          {
            x: 120,
            y: 0,
            z: 99.99999999999999
          },
          {
            x: 110,
            y: 0,
            z: 90
          }
        ]
      },
      state: 0,
      isLocked: false
    },
    {
      id: 'W*KXLPiESf',
      type: 'TrackSwitch',
      segmentLeftData: {
        startJointEnd: {
          end: 'A',
          joint: 'zghtjBmL3e'
        },
        endJointEnd: {
          end: 'B',
          joint: 'RP1ZFPK561'
        },
        coordinates: [
          {
            x: 100,
            y: 0,
            z: -10
          },
          {
            x: 100,
            y: 0,
            z: 10
          }
        ]
      },
      segmentRightData: {
        startJointEnd: {
          end: 'A',
          joint: 'zghtjBmL3e'
        },
        endJointEnd: {
          end: 'A',
          joint: 'cUIGoqZbih'
        },
        coordinates: [
          {
            x: 100,
            y: 0,
            z: -10
          },
          {
            x: 100,
            y: 0,
            z: 0
          },
          {
            x: 110,
            y: 0,
            z: 10
          }
        ]
      },
      state: 0,
      isLocked: false
    },
    {
      id: 'Yl0shbSau',
      type: 'Platform',
      track: '5NRfqzqajW',
      start: 0.125,
      end: 0.875,
      side: 'Left',
      width: 7.5
    },
    {
      id: 'awTHAe1Wi',
      type: 'Platform',
      track: '5dYWK2K308',
      start: 0.125,
      end: 0.875,
      side: 'Right',
      width: 7.5
    },
    {
      id: 'et_*OAbXe',
      type: 'Platform',
      track: 'mjbjKS18CB',
      start: 0.125,
      end: 0.875,
      side: 'Left',
      width: 7.5
    },
    {
      id: 'N9lb9GCVb',
      type: 'Platform',
      track: 'tYnNTUUbl1',
      start: 0.125,
      end: 0.875,
      side: 'Right',
      width: 7.5
    },
    {
      id: 'pZZKGtvm3',
      type: 'Platform',
      track: 'CXmHAihAP1',
      start: 0.125,
      end: 0.875,
      side: 'Right',
      width: 7.5
    },
    {
      id: 'lW6er5aIz',
      type: 'Platform',
      track: '9aPB*kbawF',
      start: 0.125,
      end: 0.875,
      side: 'Left',
      width: 7.5
    },
    {
      id: 'vDXEpy6BL',
      type: 'Platform',
      track: '4BELLPWgjt',
      start: 0.125,
      end: 0.875,
      side: 'Left',
      width: 7.5
    },
    {
      id: 'sKo02_5*s',
      type: 'Platform',
      track: 'whVPO4MjB9',
      start: 0.125,
      end: 0.875,
      side: 'Right',
      width: 7.5
    },
    {
      id: 'M*0Ro_RVC',
      type: 'Platform',
      track: 'M7Zhwz1a0h',
      start: 0.125,
      end: 0.875,
      side: 'Left',
      width: 7.5
    },
    {
      id: 'bx2FxxL_H',
      type: 'Wagon',
      seatCount: 21,
      seatColumns: 3,
      seats: [],
      config: {
        passengerArrangement: {
          seats: 3,
          rows: 7
        },
        appearanceId: 'mot',
        length: 14,
        connectable: {
          A: 0,
          B: 0
        },
        control: {
          A: true,
          B: true
        },
        engine: true,
        appearanceFacing: 'AB'
      }
    },
    {
      id: 'D12BWpNHl',
      type: 'Wagon',
      seatCount: 21,
      seatColumns: 3,
      seats: [],
      config: {
        passengerArrangement: {
          seats: 3,
          rows: 7
        },
        appearanceId: 'mot',
        length: 14,
        connectable: {
          A: 0,
          B: 0
        },
        control: {
          A: true,
          B: true
        },
        engine: true,
        appearanceFacing: 'AB'
      }
    },
    {
      id: 'LVOIJ1hCI',
      type: 'Wagon',
      seatCount: 21,
      seatColumns: 3,
      seats: [],
      config: {
        passengerArrangement: {
          seats: 3,
          rows: 7
        },
        appearanceId: 'mot',
        length: 14,
        connectable: {
          A: 0,
          B: 0
        },
        control: {
          A: true,
          B: true
        },
        engine: true,
        appearanceFacing: 'AB'
      }
    },
    {
      id: '6l*RZ6cci',
      type: 'Wagon',
      seatCount: 21,
      seatColumns: 3,
      seats: [],
      config: {
        passengerArrangement: {
          seats: 3,
          rows: 7
        },
        appearanceId: 'mot',
        length: 14,
        connectable: {
          A: 0,
          B: 0
        },
        control: {
          A: true,
          B: true
        },
        engine: true,
        appearanceFacing: 'AB'
      }
    },
    {
      id: 'rmTU0mfeIb',
      type: 'Train',
      autoMode: true,
      position: {
        trackId: 'tYnNTUUbl1',
        direction: 'AB',
        position: 14
      },
      speed: {
        speed: 0,
        shunting: false,
        pedal: 0
      },
      wagons: [
        {
          wagon: 'bx2FxxL_H',
          trip: 'uOycLYlcU'
        }
      ],
      trips: ['uOycLYlcU']
    },
    {
      id: 'LHA02P491D',
      type: 'Train',
      autoMode: true,
      position: {
        trackId: 'mjbjKS18CB',
        direction: 'AB',
        position: 14
      },
      speed: {
        speed: 0,
        shunting: false,
        pedal: 0
      },
      wagons: [
        {
          wagon: 'D12BWpNHl',
          trip: 'hNcfFKjol'
        }
      ],
      trips: ['hNcfFKjol']
    },
    {
      id: 'Or04la8Sx1',
      type: 'Train',
      autoMode: true,
      position: {
        trackId: '5dYWK2K308',
        direction: 'AB',
        position: 14
      },
      speed: {
        speed: 0,
        shunting: false,
        pedal: 0
      },
      wagons: [
        {
          wagon: 'LVOIJ1hCI',
          trip: 'PupD3DdfE'
        }
      ],
      trips: ['PupD3DdfE']
    },
    {
      id: 'B5NxFppMWL',
      type: 'Train',
      autoMode: true,
      position: {
        trackId: '5NRfqzqajW',
        direction: 'AB',
        position: 14
      },
      speed: {
        speed: 0,
        shunting: false,
        pedal: 0
      },
      wagons: [
        {
          wagon: '6l*RZ6cci',
          trip: 'P*f6pIicn'
        }
      ],
      trips: ['P*f6pIicn']
    },
    {
      id: 'LwzIVTQi9',
      type: 'Passenger',
      from: 'aJ2GpnXMV',
      to: 'rWN0HLuNc',
      place: 'aJ2GpnXMV'
    },
    {
      id: 'bYUjXzIKq',
      type: 'Passenger',
      from: 'aJ2GpnXMV',
      to: 'oFjCo5ZHD',
      place: 'aJ2GpnXMV'
    },
    {
      id: 'oYUGcOYuv6',
      type: 'Passenger',
      from: 'hS1g7kyNn',
      to: 'aJ2GpnXMV',
      place: 'hS1g7kyNn'
    },
    {
      id: 'WThj1h9wKc',
      type: 'Passenger',
      from: 'aJ2GpnXMV',
      to: 'rWN0HLuNc',
      place: 'aJ2GpnXMV'
    },
    {
      id: '9LuXTOQ_*n',
      type: 'Passenger',
      from: 'oFjCo5ZHD',
      to: 'hS1g7kyNn',
      place: 'oFjCo5ZHD'
    },
    {
      id: 'xkA37Yd_JF',
      type: 'Passenger',
      from: 'oFjCo5ZHD',
      to: 'hS1g7kyNn',
      place: 'oFjCo5ZHD'
    },
    {
      id: '0kb2Aihqrk',
      type: 'Passenger',
      from: 'rWN0HLuNc',
      to: 'aJ2GpnXMV',
      place: 'rWN0HLuNc'
    },
    {
      id: '0F*VDE7mIc',
      type: 'Passenger',
      from: 'aJ2GpnXMV',
      to: 'hS1g7kyNn',
      place: 'aJ2GpnXMV'
    },
    {
      id: 'FYI8p7O7wx',
      type: 'Passenger',
      from: 'oFjCo5ZHD',
      to: 'hS1g7kyNn',
      place: 'oFjCo5ZHD'
    },
    {
      id: 'HmmDXmpVVD',
      type: 'Passenger',
      from: 'aJ2GpnXMV',
      to: 'hS1g7kyNn',
      place: 'aJ2GpnXMV'
    },
    {
      id: 'H1YW*6rJmI',
      type: 'Passenger',
      from: 'hS1g7kyNn',
      to: 'rWN0HLuNc',
      place: 'hS1g7kyNn'
    },
    {
      id: 'Qx8UbAfn3l',
      type: 'Passenger',
      from: 'rWN0HLuNc',
      to: 'hS1g7kyNn',
      place: 'rWN0HLuNc'
    },
    {
      id: 'Vzj4z5NlrX',
      type: 'Passenger',
      from: 'oFjCo5ZHD',
      to: 'aJ2GpnXMV',
      place: 'oFjCo5ZHD'
    },
    {
      id: 'en7lyhtU4*',
      type: 'Passenger',
      from: 'rWN0HLuNc',
      to: 'hS1g7kyNn',
      place: 'rWN0HLuNc'
    },
    {
      id: 'S3nucQasoV',
      type: 'Passenger',
      from: 'aJ2GpnXMV',
      to: 'oFjCo5ZHD',
      place: 'aJ2GpnXMV'
    },
    {
      id: 'OZFyJZ8EAN',
      type: 'Passenger',
      from: 'rWN0HLuNc',
      to: 'aJ2GpnXMV',
      place: 'rWN0HLuNc'
    },
    {
      id: '_tGPXF1oNY',
      type: 'Passenger',
      from: 'rWN0HLuNc',
      to: 'hS1g7kyNn',
      place: 'rWN0HLuNc'
    },
    {
      id: 'bVy7LmMZ0qX',
      type: 'Passenger',
      from: 'oFjCo5ZHD',
      to: 'hS1g7kyNn',
      place: 'oFjCo5ZHD'
    },
    {
      id: 'tVvEC0L_ZIH',
      type: 'Passenger',
      from: 'aJ2GpnXMV',
      to: 'hS1g7kyNn',
      place: 'aJ2GpnXMV'
    },
    {
      id: 'Kb53qebq7KH',
      type: 'Passenger',
      from: 'aJ2GpnXMV',
      to: 'rWN0HLuNc',
      place: 'aJ2GpnXMV'
    },
    {
      id: '4LIOcCIGx',
      type: 'Passenger',
      from: 'aJ2GpnXMV',
      to: 'rWN0HLuNc',
      place: 'aJ2GpnXMV'
    },
    {
      id: 'fT4M15mLu',
      type: 'Passenger',
      from: 'aJ2GpnXMV',
      to: 'oFjCo5ZHD',
      place: 'aJ2GpnXMV'
    },
    {
      id: 'c4f5*IXbn',
      type: 'Passenger',
      from: 'aJ2GpnXMV',
      to: 'hS1g7kyNn',
      place: 'aJ2GpnXMV'
    },
    {
      id: '6qAPGG9Xs',
      type: 'BlockJoint',
      ray: {
        x: -14.374999999999998,
        y: 0,
        z: -85,
        dirXZ: 0.6435011087932845
      },
      positionOnTrack: {
        trackId: 'Q24Vnk6Wak',
        direction: 'AB',
        position: 17.209995921794217
      }
    },
    {
      id: 'rJlImUX8u',
      type: 'BlockJoint',
      ray: {
        x: 0,
        y: 0,
        z: -87.5,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'Cb21H5BwOK',
        direction: 'AB',
        position: 12.5
      }
    },
    {
      id: 'OhxYqANm7',
      type: 'BlockJoint',
      ray: {
        x: 10,
        y: 0,
        z: -87.5,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'BP*v9PfQrw',
        direction: 'AB',
        position: 12.5
      }
    },
    {
      id: 'uKawu36JF',
      type: 'BlockJoint',
      ray: {
        x: 24.375,
        y: 0,
        z: -85,
        dirXZ: -0.6435011087932845
      },
      positionOnTrack: {
        trackId: '652lnQOGka',
        direction: 'AB',
        position: 17.209995921794217
      }
    },
    {
      id: 'pBNExBjO8',
      type: 'BlockJoint',
      ray: {
        x: -14.375,
        y: 0,
        z: -25,
        dirXZ: -0.6435011087932845
      },
      positionOnTrack: {
        trackId: 'euZWN5I34S',
        direction: 'AB',
        position: 5.73666530726474
      }
    },
    {
      id: 'o23zwHMj6',
      type: 'BlockJoint',
      ray: {
        x: -20,
        y: 0,
        z: 25,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'e86W1EWH7x',
        direction: 'AB',
        position: 15
      }
    },
    {
      id: 'e68HwcqSZ',
      type: 'BlockJoint',
      ray: {
        x: -34.375,
        y: 0,
        z: 55,
        dirXZ: -0.6435011087932845
      },
      positionOnTrack: {
        trackId: 'K4LnfjqsEM',
        direction: 'AB',
        position: 5.73666530726474
      }
    },
    {
      id: 'hx6LXzhjC',
      type: 'BlockJoint',
      ray: {
        x: -20,
        y: 0,
        z: 57.5,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'oZSI*kEu3c',
        direction: 'AB',
        position: 7.5
      }
    },
    {
      id: 'HsC02XoHV',
      type: 'BlockJoint',
      ray: {
        x: 17.5,
        y: 0,
        z: 140,
        dirXZ: 1.5707963267948966
      },
      positionOnTrack: {
        trackId: 'IUlgO66hli',
        direction: 'AB',
        position: 7.5
      }
    },
    {
      id: 'Pwa4LHeoM',
      type: 'BlockJoint',
      ray: {
        x: -14.374999999999998,
        y: 0,
        z: 125,
        dirXZ: 0.643501108793284
      },
      positionOnTrack: {
        trackId: '01ZRRy0xph',
        direction: 'AB',
        position: 17.209995921794217
      }
    },
    {
      id: 'oo7XtSIH5',
      type: 'BlockJoint',
      ray: {
        x: -20,
        y: 0,
        z: 137.5,
        dirXZ: 1.1071487177940904
      },
      positionOnTrack: {
        trackId: 'LDnPaGY3fx',
        direction: 'AB',
        position: 11.47333061452948
      }
    },
    {
      id: 'SWnAOGvlG',
      type: 'BlockJoint',
      ray: {
        x: 119.375,
        y: 0,
        z: 115,
        dirXZ: 2.8966139904629284
      },
      positionOnTrack: {
        trackId: 'nt2*HCihkQ',
        direction: 'AB',
        position: 17.20999592179422
      }
    },
    {
      id: '2c8E3hpUy',
      type: 'BlockJoint',
      ray: {
        x: 120,
        y: 0,
        z: 85,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: 'RjJQdOSaoM',
        direction: 'AB',
        position: 5
      }
    },
    {
      id: '_Ez6nYmP8',
      type: 'BlockJoint',
      ray: {
        x: 107.65625,
        y: 0,
        z: 87.5,
        dirXZ: -2.4227626539681686
      },
      positionOnTrack: {
        trackId: 'YctvefyM3f',
        direction: 'AB',
        position: 2.86833265363237
      }
    },
    {
      id: 'Onr7hTULW',
      type: 'BlockJoint',
      ray: {
        x: 112.34375,
        y: 0,
        z: 12.499999999999998,
        dirXZ: -2.4227626539681686
      },
      positionOnTrack: {
        trackId: 'EfODpYVvww',
        direction: 'AB',
        position: 20.07832857542659
      }
    },
    {
      id: '7TBO_wlM4',
      type: 'BlockJoint',
      ray: {
        x: 100,
        y: 0,
        z: 15,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'MTNAZC79J',
        direction: 'AB',
        position: 5
      }
    },
    {
      id: 'bFxUK9cEK',
      type: 'BlockJoint',
      ray: {
        x: 100,
        y: 0,
        z: -15,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: '_8MryH*RNL',
        direction: 'AB',
        position: 5
      }
    },
    {
      id: '8fypR3HZo',
      type: 'BlockJoint',
      ray: {
        x: 100,
        y: 0,
        z: -90,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: 'M7Zhwz1a0h',
        direction: 'AB',
        position: 40
      }
    },
    {
      id: '_hV00cNZJ',
      type: 'BlockJoint',
      ray: {
        x: 30,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: '5NRfqzqajW',
        direction: 'AB',
        position: 0
      }
    },
    {
      id: 'msWxgzAEj',
      type: 'BlockJoint',
      ray: {
        x: 10,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: '5dYWK2K308',
        direction: 'AB',
        position: 0
      }
    },
    {
      id: 'V_3skoULl',
      type: 'BlockJoint',
      ray: {
        x: 0,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'mjbjKS18CB',
        direction: 'AB',
        position: 0
      }
    },
    {
      id: 't1HLNipW_',
      type: 'BlockJoint',
      ray: {
        x: -20,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'tYnNTUUbl1',
        direction: 'AB',
        position: 0
      }
    },
    {
      id: 'ZbkMSfzo_',
      type: 'BlockJoint',
      ray: {
        x: 72.5,
        y: 0,
        z: 140,
        dirXZ: 1.5707963267948966
      },
      positionOnTrack: {
        trackId: 'FYuVYbZDlv',
        direction: 'AB',
        position: 2.5
      }
    },
    {
      id: 'Ocmxxl4hU',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 't1HLNipW_',
          signal: 'Green',
          hidden: false
        },
        endJointEnd: {
          end: 'B',
          joint: '6qAPGG9Xs',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: -20,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      rayB: {
        x: -14.374999999999998,
        y: 0,
        z: -85,
        dirXZ: 0.6435011087932845
      },
      coords: [
        {
          x: -20,
          y: 0,
          z: -140
        },
        {
          x: -20,
          y: 0,
          z: -135
        },
        {
          x: -20,
          y: 0,
          z: -130
        },
        {
          x: -20,
          y: 0,
          z: -125
        },
        {
          x: -20,
          y: 0,
          z: -120
        },
        {
          x: -20,
          y: 0,
          z: -115
        },
        {
          x: -20,
          y: 0,
          z: -110
        },
        {
          x: -20,
          y: 0,
          z: -105
        },
        {
          x: -20,
          y: 0,
          z: -100
        },
        {
          x: -20,
          y: 0,
          z: -100
        },
        {
          x: -19.84375,
          y: 0,
          z: -97.5
        },
        {
          x: -19.375,
          y: 0,
          z: -95
        },
        {
          x: -18.59375,
          y: 0,
          z: -92.5
        },
        {
          x: -17.5,
          y: 0,
          z: -90
        },
        {
          x: -16.09375,
          y: 0,
          z: -87.5
        },
        {
          x: -14.374999999999998,
          y: 0,
          z: -85
        },
        {
          x: -14.374999999999998,
          y: 0,
          z: -85
        }
      ]
    },
    {
      id: 'PhCp4KBj2',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'V_3skoULl',
          signal: 'Green',
          hidden: false
        },
        endJointEnd: {
          end: 'B',
          joint: 'rJlImUX8u',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: 0,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      rayB: {
        x: 0,
        y: 0,
        z: -87.5,
        dirXZ: 0
      },
      coords: [
        {
          x: 0,
          y: 0,
          z: -140
        },
        {
          x: 0,
          y: 0,
          z: -135
        },
        {
          x: 0,
          y: 0,
          z: -130
        },
        {
          x: 0,
          y: 0,
          z: -125
        },
        {
          x: 0,
          y: 0,
          z: -120
        },
        {
          x: 0,
          y: 0,
          z: -115
        },
        {
          x: 0,
          y: 0,
          z: -110
        },
        {
          x: 0,
          y: 0,
          z: -105
        },
        {
          x: 0,
          y: 0,
          z: -100
        },
        {
          x: 0,
          y: 0,
          z: -100
        },
        {
          x: 0,
          y: 0,
          z: -97.5
        },
        {
          x: 0,
          y: 0,
          z: -95
        },
        {
          x: 0,
          y: 0,
          z: -92.5
        },
        {
          x: 0,
          y: 0,
          z: -90
        },
        {
          x: 0,
          y: 0,
          z: -87.5
        }
      ]
    },
    {
      id: 'IXuKLUUrr',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'msWxgzAEj',
          signal: 'Green',
          hidden: false
        },
        endJointEnd: {
          end: 'B',
          joint: 'OhxYqANm7',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: 10,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      rayB: {
        x: 10,
        y: 0,
        z: -87.5,
        dirXZ: 0
      },
      coords: [
        {
          x: 10,
          y: 0,
          z: -140
        },
        {
          x: 10,
          y: 0,
          z: -135
        },
        {
          x: 10,
          y: 0,
          z: -130
        },
        {
          x: 10,
          y: 0,
          z: -125
        },
        {
          x: 10,
          y: 0,
          z: -120
        },
        {
          x: 10,
          y: 0,
          z: -115
        },
        {
          x: 10,
          y: 0,
          z: -110
        },
        {
          x: 10,
          y: 0,
          z: -105
        },
        {
          x: 10,
          y: 0,
          z: -100
        },
        {
          x: 10,
          y: 0,
          z: -100
        },
        {
          x: 10,
          y: 0,
          z: -97.5
        },
        {
          x: 10,
          y: 0,
          z: -95
        },
        {
          x: 10,
          y: 0,
          z: -92.5
        },
        {
          x: 10,
          y: 0,
          z: -90
        },
        {
          x: 10,
          y: 0,
          z: -87.5
        }
      ]
    },
    {
      id: '6SMiE9JGl',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: '_hV00cNZJ',
          signal: 'Green',
          hidden: false
        },
        endJointEnd: {
          end: 'B',
          joint: 'uKawu36JF',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: 30,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      rayB: {
        x: 24.375,
        y: 0,
        z: -85,
        dirXZ: -0.6435011087932845
      },
      coords: [
        {
          x: 30,
          y: 0,
          z: -140
        },
        {
          x: 30,
          y: 0,
          z: -135
        },
        {
          x: 30,
          y: 0,
          z: -130
        },
        {
          x: 30,
          y: 0,
          z: -125
        },
        {
          x: 30,
          y: 0,
          z: -120
        },
        {
          x: 30,
          y: 0,
          z: -115
        },
        {
          x: 30,
          y: 0,
          z: -110
        },
        {
          x: 30,
          y: 0,
          z: -105
        },
        {
          x: 30,
          y: 0,
          z: -100
        },
        {
          x: 30,
          y: 0,
          z: -100
        },
        {
          x: 29.84375,
          y: 0,
          z: -97.5
        },
        {
          x: 29.375,
          y: 0,
          z: -95
        },
        {
          x: 28.59375,
          y: 0,
          z: -92.5
        },
        {
          x: 27.5,
          y: 0,
          z: -90
        },
        {
          x: 26.09375,
          y: 0,
          z: -87.5
        },
        {
          x: 24.375,
          y: 0,
          z: -85
        }
      ]
    },
    {
      id: 'cwXBdOQy7',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'pBNExBjO8',
          signal: 'Green',
          hidden: true
        },
        endJointEnd: {
          end: 'B',
          joint: 'o23zwHMj6',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: -14.375,
        y: 0,
        z: -25,
        dirXZ: -0.6435011087932845
      },
      rayB: {
        x: -20,
        y: 0,
        z: 25,
        dirXZ: 0
      },
      coords: [
        {
          x: -14.375,
          y: 0,
          z: -25
        },
        {
          x: -14.375,
          y: 0,
          z: -25
        },
        {
          x: -14.375,
          y: 0,
          z: -25
        },
        {
          x: -16.09375,
          y: 0,
          z: -22.5
        },
        {
          x: -17.5,
          y: 0,
          z: -20
        },
        {
          x: -18.59375,
          y: 0,
          z: -17.5
        },
        {
          x: -19.375,
          y: 0,
          z: -15.000000000000002
        },
        {
          x: -19.84375,
          y: 0,
          z: -12.5
        },
        {
          x: -20,
          y: 0,
          z: -10
        },
        {
          x: -20,
          y: 0,
          z: -10
        },
        {
          x: -20,
          y: 0,
          z: -7.5
        },
        {
          x: -20,
          y: 0,
          z: -5
        },
        {
          x: -20,
          y: 0,
          z: -2.5
        },
        {
          x: -20,
          y: 0,
          z: 0
        },
        {
          x: -20,
          y: 0,
          z: 2.5
        },
        {
          x: -20,
          y: 0,
          z: 5
        },
        {
          x: -20,
          y: 0,
          z: 7.5
        },
        {
          x: -20,
          y: 0,
          z: 10
        },
        {
          x: -20,
          y: 0,
          z: 10
        },
        {
          x: -20,
          y: 0,
          z: 12.5
        },
        {
          x: -20,
          y: 0,
          z: 15
        },
        {
          x: -20,
          y: 0,
          z: 17.5
        },
        {
          x: -20,
          y: 0,
          z: 20
        },
        {
          x: -20,
          y: 0,
          z: 22.5
        },
        {
          x: -20,
          y: 0,
          z: 25
        }
      ]
    },
    {
      id: 'wqwtQ5RoE',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'e68HwcqSZ',
          signal: 'Green',
          hidden: true
        },
        endJointEnd: {
          end: 'B',
          joint: 'oo7XtSIH5',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: -34.375,
        y: 0,
        z: 55,
        dirXZ: -0.6435011087932845
      },
      rayB: {
        x: -20,
        y: 0,
        z: 137.5,
        dirXZ: 1.1071487177940904
      },
      coords: [
        {
          x: -34.375,
          y: 0,
          z: 55
        },
        {
          x: -34.375,
          y: 0,
          z: 55
        },
        {
          x: -34.375,
          y: 0,
          z: 55
        },
        {
          x: -36.09375,
          y: 0,
          z: 57.5
        },
        {
          x: -37.5,
          y: 0,
          z: 60
        },
        {
          x: -38.59375,
          y: 0,
          z: 62.5
        },
        {
          x: -39.375,
          y: 0,
          z: 65
        },
        {
          x: -39.84375,
          y: 0,
          z: 67.5
        },
        {
          x: -40,
          y: 0,
          z: 70
        },
        {
          x: -40,
          y: 0,
          z: 70
        },
        {
          x: -40,
          y: 0,
          z: 75
        },
        {
          x: -40,
          y: 0,
          z: 80
        },
        {
          x: -40,
          y: 0,
          z: 85
        },
        {
          x: -40,
          y: 0,
          z: 90
        },
        {
          x: -40,
          y: 0,
          z: 95
        },
        {
          x: -40,
          y: 0,
          z: 100
        },
        {
          x: -40,
          y: 0,
          z: 105
        },
        {
          x: -40,
          y: 0,
          z: 110
        },
        {
          x: -40,
          y: 0,
          z: 110
        },
        {
          x: -39.84375,
          y: 0,
          z: 112.5
        },
        {
          x: -39.375,
          y: 0,
          z: 115
        },
        {
          x: -38.59375,
          y: 0,
          z: 117.5
        },
        {
          x: -37.5,
          y: 0,
          z: 120
        },
        {
          x: -36.09375,
          y: 0,
          z: 122.5
        },
        {
          x: -34.375,
          y: 0,
          z: 125
        },
        {
          x: -32.34375,
          y: 0,
          z: 127.5
        },
        {
          x: -30,
          y: 0,
          z: 130
        },
        {
          x: -30,
          y: 0,
          z: 130
        },
        {
          x: -27.5,
          y: 0,
          z: 132.34375
        },
        {
          x: -25,
          y: 0,
          z: 134.375
        },
        {
          x: -22.5,
          y: 0,
          z: 136.09375
        },
        {
          x: -20,
          y: 0,
          z: 137.5
        }
      ]
    },
    {
      id: 'QPdrlnUa3',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'hx6LXzhjC',
          signal: 'Green',
          hidden: true
        },
        endJointEnd: {
          end: 'B',
          joint: 'Pwa4LHeoM',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: -20,
        y: 0,
        z: 57.5,
        dirXZ: 0
      },
      rayB: {
        x: -14.374999999999998,
        y: 0,
        z: 125,
        dirXZ: 0.643501108793284
      },
      coords: [
        {
          x: -20,
          y: 0,
          z: 57.5
        },
        {
          x: -20,
          y: 0,
          z: 57.5
        },
        {
          x: -20,
          y: 0,
          z: 57.5
        },
        {
          x: -20,
          y: 0,
          z: 60
        },
        {
          x: -20,
          y: 0,
          z: 62.5
        },
        {
          x: -20,
          y: 0,
          z: 65
        },
        {
          x: -20,
          y: 0,
          z: 67.5
        },
        {
          x: -20,
          y: 0,
          z: 70
        },
        {
          x: -20,
          y: 0,
          z: 70
        },
        {
          x: -20,
          y: 0,
          z: 75
        },
        {
          x: -20,
          y: 0,
          z: 80
        },
        {
          x: -20,
          y: 0,
          z: 85
        },
        {
          x: -20,
          y: 0,
          z: 90
        },
        {
          x: -20,
          y: 0,
          z: 95
        },
        {
          x: -20,
          y: 0,
          z: 100
        },
        {
          x: -20,
          y: 0,
          z: 105
        },
        {
          x: -20,
          y: 0,
          z: 110
        },
        {
          x: -20,
          y: 0,
          z: 110
        },
        {
          x: -19.84375,
          y: 0,
          z: 112.5
        },
        {
          x: -19.375,
          y: 0,
          z: 115
        },
        {
          x: -18.59375,
          y: 0,
          z: 117.5
        },
        {
          x: -17.5,
          y: 0,
          z: 120
        },
        {
          x: -16.09375,
          y: 0,
          z: 122.5
        },
        {
          x: -14.374999999999998,
          y: 0,
          z: 125
        },
        {
          x: -14.374999999999998,
          y: 0,
          z: 125
        }
      ]
    },
    {
      id: '5IqJQ0VXd',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'HsC02XoHV',
          signal: 'Green',
          hidden: true
        },
        endJointEnd: {
          end: 'B',
          joint: 'ZbkMSfzo_',
          signal: 'Green',
          hidden: false
        }
      },
      isFree: true,
      rayA: {
        x: 17.5,
        y: 0,
        z: 140,
        dirXZ: 1.5707963267948966
      },
      rayB: {
        x: 72.5,
        y: 0,
        z: 140,
        dirXZ: 1.5707963267948966
      },
      coords: [
        {
          x: 17.5,
          y: 0,
          z: 140
        },
        {
          x: 17.5,
          y: 0,
          z: 140
        },
        {
          x: 17.5,
          y: 0,
          z: 140
        },
        {
          x: 20,
          y: 0,
          z: 140
        },
        {
          x: 22.5,
          y: 0,
          z: 140
        },
        {
          x: 25,
          y: 0,
          z: 140
        },
        {
          x: 27.5,
          y: 0,
          z: 140
        },
        {
          x: 30,
          y: 0,
          z: 140
        },
        {
          x: 30,
          y: 0,
          z: 140
        },
        {
          x: 32.5,
          y: 0,
          z: 140
        },
        {
          x: 35,
          y: 0,
          z: 140
        },
        {
          x: 37.5,
          y: 0,
          z: 140
        },
        {
          x: 40,
          y: 0,
          z: 140
        },
        {
          x: 42.5,
          y: 0,
          z: 140
        },
        {
          x: 45,
          y: 0,
          z: 140
        },
        {
          x: 47.5,
          y: 0,
          z: 140
        },
        {
          x: 50,
          y: 0,
          z: 140
        },
        {
          x: 50,
          y: 0,
          z: 140
        },
        {
          x: 52.5,
          y: 0,
          z: 140
        },
        {
          x: 55,
          y: 0,
          z: 140
        },
        {
          x: 57.5,
          y: 0,
          z: 140
        },
        {
          x: 60,
          y: 0,
          z: 140
        },
        {
          x: 62.5,
          y: 0,
          z: 140
        },
        {
          x: 65,
          y: 0,
          z: 140
        },
        {
          x: 67.5,
          y: 0,
          z: 140
        },
        {
          x: 70,
          y: 0,
          z: 140
        },
        {
          x: 70,
          y: 0,
          z: 140
        },
        {
          x: 72.5,
          y: 0,
          z: 140
        }
      ]
    },
    {
      id: '9hevUAaL2',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'ZbkMSfzo_',
          signal: 'Green',
          hidden: false
        },
        endJointEnd: {
          end: 'B',
          joint: 'SWnAOGvlG',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: 72.5,
        y: 0,
        z: 140,
        dirXZ: 1.5707963267948966
      },
      rayB: {
        x: 119.375,
        y: 0,
        z: 115,
        dirXZ: 2.8966139904629284
      },
      coords: [
        {
          x: 72.5,
          y: 0,
          z: 140
        },
        {
          x: 72.5,
          y: 0,
          z: 140
        },
        {
          x: 72.5,
          y: 0,
          z: 140
        },
        {
          x: 75,
          y: 0,
          z: 140
        },
        {
          x: 77.5,
          y: 0,
          z: 140
        },
        {
          x: 80,
          y: 0,
          z: 140
        },
        {
          x: 82.5,
          y: 0,
          z: 140
        },
        {
          x: 85,
          y: 0,
          z: 140
        },
        {
          x: 87.5,
          y: 0,
          z: 140
        },
        {
          x: 90,
          y: 0,
          z: 140
        },
        {
          x: 90,
          y: 0,
          z: 140
        },
        {
          x: 92.5,
          y: 0,
          z: 139.84375
        },
        {
          x: 95,
          y: 0,
          z: 139.375
        },
        {
          x: 97.5,
          y: 0,
          z: 138.59375
        },
        {
          x: 100,
          y: 0,
          z: 137.5
        },
        {
          x: 102.5,
          y: 0,
          z: 136.09375
        },
        {
          x: 105,
          y: 0,
          z: 134.375
        },
        {
          x: 107.5,
          y: 0,
          z: 132.34375
        },
        {
          x: 110,
          y: 0,
          z: 130
        },
        {
          x: 110,
          y: 0,
          z: 130
        },
        {
          x: 112.34375,
          y: 0,
          z: 127.5
        },
        {
          x: 114.375,
          y: 0,
          z: 125
        },
        {
          x: 116.09375,
          y: 0,
          z: 122.5
        },
        {
          x: 117.5,
          y: 0,
          z: 120
        },
        {
          x: 118.59375,
          y: 0,
          z: 117.5
        },
        {
          x: 119.375,
          y: 0,
          z: 115
        }
      ]
    },
    {
      id: 'pq4VOjrT5',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: '_Ez6nYmP8',
          signal: 'Green',
          hidden: true
        },
        endJointEnd: {
          end: 'A',
          joint: '7TBO_wlM4',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: 107.65625,
        y: 0,
        z: 87.5,
        dirXZ: -2.4227626539681686
      },
      rayB: {
        x: 100,
        y: 0,
        z: 15,
        dirXZ: 0
      },
      coords: [
        {
          x: 107.65625,
          y: 0,
          z: 87.5
        },
        {
          x: 107.65625,
          y: 0,
          z: 87.5
        },
        {
          x: 107.65625,
          y: 0,
          z: 87.5
        },
        {
          x: 105.625,
          y: 0,
          z: 85
        },
        {
          x: 103.90625,
          y: 0,
          z: 82.5
        },
        {
          x: 102.5,
          y: 0,
          z: 80
        },
        {
          x: 101.40625,
          y: 0,
          z: 77.5
        },
        {
          x: 100.625,
          y: 0,
          z: 75
        },
        {
          x: 100.15625,
          y: 0,
          z: 72.5
        },
        {
          x: 100,
          y: 0,
          z: 70
        },
        {
          x: 100,
          y: 0,
          z: 70
        },
        {
          x: 100,
          y: 0,
          z: 65
        },
        {
          x: 100,
          y: 0,
          z: 60
        },
        {
          x: 100,
          y: 0,
          z: 55
        },
        {
          x: 100,
          y: 0,
          z: 50
        },
        {
          x: 100,
          y: 0,
          z: 45
        },
        {
          x: 100,
          y: 0,
          z: 40
        },
        {
          x: 100,
          y: 0,
          z: 35
        },
        {
          x: 100,
          y: 0,
          z: 30
        },
        {
          x: 100,
          y: 0,
          z: 30
        },
        {
          x: 100,
          y: 0,
          z: 27.5
        },
        {
          x: 100,
          y: 0,
          z: 25
        },
        {
          x: 100,
          y: 0,
          z: 22.5
        },
        {
          x: 100,
          y: 0,
          z: 20
        },
        {
          x: 100,
          y: 0,
          z: 17.5
        },
        {
          x: 100,
          y: 0,
          z: 15
        }
      ]
    },
    {
      id: '5RzYdGCm2',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: '2c8E3hpUy',
          signal: 'Green',
          hidden: true
        },
        endJointEnd: {
          end: 'B',
          joint: 'Onr7hTULW',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: 120,
        y: 0,
        z: 85,
        dirXZ: 3.141592653589793
      },
      rayB: {
        x: 112.34375,
        y: 0,
        z: 12.499999999999998,
        dirXZ: -2.4227626539681686
      },
      coords: [
        {
          x: 120,
          y: 0,
          z: 85
        },
        {
          x: 120,
          y: 0,
          z: 85
        },
        {
          x: 120,
          y: 0,
          z: 85
        },
        {
          x: 120,
          y: 0,
          z: 82.5
        },
        {
          x: 120,
          y: 0,
          z: 80
        },
        {
          x: 120,
          y: 0,
          z: 77.5
        },
        {
          x: 120,
          y: 0,
          z: 75
        },
        {
          x: 120,
          y: 0,
          z: 72.5
        },
        {
          x: 120,
          y: 0,
          z: 70
        },
        {
          x: 120,
          y: 0,
          z: 70
        },
        {
          x: 120,
          y: 0,
          z: 65
        },
        {
          x: 120,
          y: 0,
          z: 60
        },
        {
          x: 120,
          y: 0,
          z: 55
        },
        {
          x: 120,
          y: 0,
          z: 50
        },
        {
          x: 120,
          y: 0,
          z: 45
        },
        {
          x: 120,
          y: 0,
          z: 40
        },
        {
          x: 120,
          y: 0,
          z: 35
        },
        {
          x: 120,
          y: 0,
          z: 30
        },
        {
          x: 120,
          y: 0,
          z: 30
        },
        {
          x: 119.84375,
          y: 0,
          z: 27.5
        },
        {
          x: 119.375,
          y: 0,
          z: 25
        },
        {
          x: 118.59375,
          y: 0,
          z: 22.5
        },
        {
          x: 117.5,
          y: 0,
          z: 20
        },
        {
          x: 116.09375,
          y: 0,
          z: 17.5
        },
        {
          x: 114.375,
          y: 0,
          z: 15.000000000000002
        },
        {
          x: 112.34375,
          y: 0,
          z: 12.499999999999998
        },
        {
          x: 112.34375,
          y: 0,
          z: 12.499999999999998
        }
      ]
    },
    {
      id: 'kmhOG4mZH',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'bFxUK9cEK',
          signal: 'Green',
          hidden: true
        },
        endJointEnd: {
          end: 'B',
          joint: '8fypR3HZo',
          signal: 'Green',
          hidden: false
        }
      },
      isFree: true,
      rayA: {
        x: 100,
        y: 0,
        z: -15,
        dirXZ: 3.141592653589793
      },
      rayB: {
        x: 100,
        y: 0,
        z: -90,
        dirXZ: 3.141592653589793
      },
      coords: [
        {
          x: 100,
          y: 0,
          z: -15
        },
        {
          x: 100,
          y: 0,
          z: -15
        },
        {
          x: 100,
          y: 0,
          z: -15
        },
        {
          x: 100,
          y: 0,
          z: -17.5
        },
        {
          x: 100,
          y: 0,
          z: -20
        },
        {
          x: 100,
          y: 0,
          z: -22.5
        },
        {
          x: 100,
          y: 0,
          z: -25
        },
        {
          x: 100,
          y: 0,
          z: -27.5
        },
        {
          x: 100,
          y: 0,
          z: -30
        },
        {
          x: 100,
          y: 0,
          z: -30
        },
        {
          x: 100,
          y: 0,
          z: -32.5
        },
        {
          x: 100,
          y: 0,
          z: -35
        },
        {
          x: 100,
          y: 0,
          z: -37.5
        },
        {
          x: 100,
          y: 0,
          z: -40
        },
        {
          x: 100,
          y: 0,
          z: -42.5
        },
        {
          x: 100,
          y: 0,
          z: -45
        },
        {
          x: 100,
          y: 0,
          z: -47.5
        },
        {
          x: 100,
          y: 0,
          z: -50
        },
        {
          x: 100,
          y: 0,
          z: -50
        },
        {
          x: 100,
          y: 0,
          z: -55
        },
        {
          x: 100,
          y: 0,
          z: -60
        },
        {
          x: 100,
          y: 0,
          z: -65
        },
        {
          x: 100,
          y: 0,
          z: -70
        },
        {
          x: 100,
          y: 0,
          z: -75
        },
        {
          x: 100,
          y: 0,
          z: -80
        },
        {
          x: 100,
          y: 0,
          z: -85
        },
        {
          x: 100,
          y: 0,
          z: -90
        }
      ]
    },
    {
      id: 'zsV5PZckQ',
      type: 'PathBlock',
      jointEnds: [
        {
          joint: 'uKawu36JF',
          end: 'A'
        },
        {
          joint: 'OhxYqANm7',
          end: 'A'
        },
        {
          joint: 'rJlImUX8u',
          end: 'A'
        },
        {
          joint: '6qAPGG9Xs',
          end: 'A'
        },
        {
          joint: 'pBNExBjO8',
          end: 'B'
        }
      ],
      queue: {
        rules: [
          {
            from: {
              joint: '6qAPGG9Xs',
              end: 'A'
            },
            toOptions: [
              {
                joint: 'pBNExBjO8',
                end: 'B'
              }
            ]
          },
          {
            from: {
              joint: 'rJlImUX8u',
              end: 'A'
            },
            toOptions: [
              {
                joint: 'pBNExBjO8',
                end: 'B'
              }
            ]
          },
          {
            from: {
              joint: 'OhxYqANm7',
              end: 'A'
            },
            toOptions: [
              {
                joint: 'pBNExBjO8',
                end: 'B'
              }
            ]
          },
          {
            from: {
              joint: 'uKawu36JF',
              end: 'A'
            },
            toOptions: [
              {
                joint: 'pBNExBjO8',
                end: 'B'
              }
            ]
          },
          {
            from: {
              joint: 'pBNExBjO8',
              end: 'B'
            },
            toOptions: [
              {
                joint: 'uKawu36JF',
                end: 'A'
              },
              {
                joint: 'OhxYqANm7',
                end: 'A'
              },
              {
                joint: 'rJlImUX8u',
                end: 'A'
              },
              {
                joint: '6qAPGG9Xs',
                end: 'A'
              }
            ]
          }
        ],
        queue: []
      },
      allowedPathes: []
    },
    {
      id: 'qVdaaOjqb',
      type: 'PathBlock',
      jointEnds: [
        {
          joint: 'o23zwHMj6',
          end: 'A'
        },
        {
          joint: 'e68HwcqSZ',
          end: 'B'
        },
        {
          joint: 'hx6LXzhjC',
          end: 'B'
        }
      ],
      queue: {
        rules: [
          {
            from: {
              joint: 'o23zwHMj6',
              end: 'A'
            },
            toOptions: [
              {
                joint: 'e68HwcqSZ',
                end: 'B'
              }
            ]
          },
          {
            from: {
              joint: 'e68HwcqSZ',
              end: 'B'
            },
            toOptions: [
              {
                joint: 'o23zwHMj6',
                end: 'A'
              }
            ]
          },
          {
            from: {
              joint: 'hx6LXzhjC',
              end: 'B'
            },
            toOptions: [
              {
                joint: 'o23zwHMj6',
                end: 'A'
              }
            ]
          }
        ],
        queue: []
      },
      allowedPathes: []
    },
    {
      id: 'kLd9FmsQY',
      type: 'PathBlock',
      jointEnds: [
        {
          joint: 'Pwa4LHeoM',
          end: 'A'
        },
        {
          joint: 'oo7XtSIH5',
          end: 'A'
        },
        {
          joint: 'HsC02XoHV',
          end: 'B'
        }
      ],
      queue: {
        rules: [
          {
            from: {
              joint: 'HsC02XoHV',
              end: 'B'
            },
            toOptions: [
              {
                joint: 'Pwa4LHeoM',
                end: 'A'
              }
            ]
          },
          {
            from: {
              joint: 'oo7XtSIH5',
              end: 'A'
            },
            toOptions: [
              {
                joint: 'HsC02XoHV',
                end: 'B'
              }
            ]
          },
          {
            from: {
              joint: 'Pwa4LHeoM',
              end: 'A'
            },
            toOptions: [
              {
                joint: 'HsC02XoHV',
                end: 'B'
              }
            ]
          }
        ],
        queue: []
      },
      allowedPathes: []
    },
    {
      id: '1KXJMTmpW',
      type: 'PathBlock',
      jointEnds: [
        {
          joint: 'SWnAOGvlG',
          end: 'A'
        },
        {
          joint: '2c8E3hpUy',
          end: 'B'
        },
        {
          joint: '_Ez6nYmP8',
          end: 'B'
        }
      ],
      queue: {
        rules: [
          {
            from: {
              joint: 'SWnAOGvlG',
              end: 'A'
            },
            toOptions: [
              {
                joint: '2c8E3hpUy',
                end: 'B'
              }
            ]
          },
          {
            from: {
              joint: '2c8E3hpUy',
              end: 'B'
            },
            toOptions: [
              {
                joint: 'SWnAOGvlG',
                end: 'A'
              }
            ]
          },
          {
            from: {
              joint: '_Ez6nYmP8',
              end: 'B'
            },
            toOptions: [
              {
                joint: 'SWnAOGvlG',
                end: 'A'
              }
            ]
          }
        ],
        queue: []
      },
      allowedPathes: []
    },
    {
      id: 'XowuSkc5h',
      type: 'PathBlock',
      jointEnds: [
        {
          joint: 'Onr7hTULW',
          end: 'A'
        },
        {
          joint: '7TBO_wlM4',
          end: 'B'
        },
        {
          joint: 'bFxUK9cEK',
          end: 'B'
        }
      ],
      queue: {
        rules: [
          {
            from: {
              joint: 'bFxUK9cEK',
              end: 'B'
            },
            toOptions: [
              {
                joint: '7TBO_wlM4',
                end: 'B'
              }
            ]
          },
          {
            from: {
              joint: '7TBO_wlM4',
              end: 'B'
            },
            toOptions: [
              {
                joint: 'Onr7hTULW',
                end: 'A'
              }
            ]
          },
          {
            from: {
              joint: 'Onr7hTULW',
              end: 'A'
            },
            toOptions: [
              {
                joint: 'bFxUK9cEK',
                end: 'B'
              }
            ]
          }
        ],
        queue: []
      },
      allowedPathes: []
    },
    {
      id: 'ik*vaXF5d5',
      type: 'Sensor',
      positionOnTrack: {
        trackId: '5NRfqzqajW',
        direction: 'AB',
        position: 27.209995921794217
      },
      pathBlock: 'zsV5PZckQ',
      pathBlockEnd: {
        end: 'A',
        joint: 'uKawu36JF',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: 30,
        y: 0,
        z: -112.79000407820578,
        dirXZ: 0
      }
    },
    {
      id: 'Qju4AVMPA3',
      type: 'Sensor',
      positionOnTrack: {
        trackId: '5dYWK2K308',
        direction: 'AB',
        position: 22.5
      },
      pathBlock: 'zsV5PZckQ',
      pathBlockEnd: {
        end: 'A',
        joint: 'OhxYqANm7',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: 10,
        y: 0,
        z: -117.5,
        dirXZ: 0
      }
    },
    {
      id: '2R1R3GI8Gj',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'mjbjKS18CB',
        direction: 'AB',
        position: 22.5
      },
      pathBlock: 'zsV5PZckQ',
      pathBlockEnd: {
        end: 'A',
        joint: 'rJlImUX8u',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: 0,
        y: 0,
        z: -117.5,
        dirXZ: 0
      }
    },
    {
      id: '38IQkrEt1R',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'tYnNTUUbl1',
        direction: 'AB',
        position: 27.209995921794217
      },
      pathBlock: 'zsV5PZckQ',
      pathBlockEnd: {
        end: 'A',
        joint: '6qAPGG9Xs',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: -20,
        y: 0,
        z: -112.79000407820578,
        dirXZ: 0
      }
    },
    {
      id: 'Z2yS5jOSba',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'FzcX2v_vz4',
        direction: 'BA',
        position: 7.209995921794221
      },
      pathBlock: 'zsV5PZckQ',
      pathBlockEnd: {
        end: 'B',
        joint: 'pBNExBjO8',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: -20,
        y: 0,
        z: 2.7900040782057793,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'kpFMHNLoiI',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'FzcX2v_vz4',
        direction: 'AB',
        position: 5
      },
      pathBlock: 'qVdaaOjqb',
      pathBlockEnd: {
        end: 'A',
        joint: 'o23zwHMj6',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: -20,
        y: 0,
        z: -5,
        dirXZ: 0
      }
    },
    {
      id: '7OrPRyLShY',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'CXmHAihAP1',
        direction: 'BA',
        position: 27.20999592179422
      },
      pathBlock: 'qVdaaOjqb',
      pathBlockEnd: {
        end: 'B',
        joint: 'e68HwcqSZ',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: -40,
        y: 0,
        z: 82.79000407820578,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'oMLTuafG9S',
      type: 'Sensor',
      positionOnTrack: {
        trackId: '9aPB*kbawF',
        direction: 'BA',
        position: 22.5
      },
      pathBlock: 'qVdaaOjqb',
      pathBlockEnd: {
        end: 'B',
        joint: 'hx6LXzhjC',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: -20,
        y: 0,
        z: 87.5,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'EWK6Anbkxr',
      type: 'Sensor',
      positionOnTrack: {
        trackId: '9aPB*kbawF',
        direction: 'AB',
        position: 27.209995921794217
      },
      pathBlock: 'kLd9FmsQY',
      pathBlockEnd: {
        end: 'A',
        joint: 'Pwa4LHeoM',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: -20,
        y: 0,
        z: 97.20999592179422,
        dirXZ: 0
      }
    },
    {
      id: 'exRdA0Ka7N',
      type: 'Sensor',
      positionOnTrack: {
        trackId: '3hTojeYNMT',
        direction: 'AB',
        position: 4.419991843588434
      },
      pathBlock: 'kLd9FmsQY',
      pathBlockEnd: {
        end: 'A',
        joint: 'oo7XtSIH5',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: -39.628974355799805,
        y: 0,
        z: 113.85240519260473,
        dirXZ: 0.19028969056710626
      }
    },
    {
      id: 'eJ63*NRj*b',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'vipp_tMA0Z',
        direction: 'BA',
        position: 2.5
      },
      pathBlock: 'kLd9FmsQY',
      pathBlockEnd: {
        end: 'B',
        joint: 'HsC02XoHV',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: 47.5,
        y: 0,
        z: 140,
        dirXZ: -1.5707963267948966
      }
    },
    {
      id: '3vLtCOKAa7',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'SYbmrWY4MO',
        direction: 'AB',
        position: 10.156657150853174
      },
      pathBlock: '1KXJMTmpW',
      pathBlockEnd: {
        end: 'A',
        joint: 'SWnAOGvlG',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: 98.85240519260475,
        y: 0,
        z: 138.0408730576486,
        dirXZ: 1.987496337213877
      }
    },
    {
      id: 'iPTlyHMZiq',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'whVPO4MjB9',
        direction: 'BA',
        position: 25
      },
      pathBlock: '1KXJMTmpW',
      pathBlockEnd: {
        end: 'B',
        joint: '2c8E3hpUy',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: 120,
        y: 0,
        z: 55,
        dirXZ: 0
      }
    },
    {
      id: 'zfwA*nNJJL',
      type: 'Sensor',
      positionOnTrack: {
        trackId: '4BELLPWgjt',
        direction: 'BA',
        position: 30.07832857542659
      },
      pathBlock: '1KXJMTmpW',
      pathBlockEnd: {
        end: 'B',
        joint: '_Ez6nYmP8',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: 100,
        y: 0,
        z: 60.07832857542658,
        dirXZ: 0
      }
    },
    {
      id: 'zkU23ar3Bn',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'whVPO4MjB9',
        direction: 'AB',
        position: 30.07832857542659
      },
      pathBlock: 'XowuSkc5h',
      pathBlockEnd: {
        end: 'A',
        joint: 'Onr7hTULW',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: 120,
        y: 0,
        z: 39.92167142457341,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'VxSzQ4vGaK',
      type: 'Sensor',
      positionOnTrack: {
        trackId: '4BELLPWgjt',
        direction: 'AB',
        position: 25
      },
      pathBlock: 'XowuSkc5h',
      pathBlockEnd: {
        end: 'B',
        joint: '7TBO_wlM4',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: 100,
        y: 0,
        z: 45,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'mNDTX1rgBA',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'ARLSeYUlDn',
        direction: 'BA',
        position: 5
      },
      pathBlock: 'XowuSkc5h',
      pathBlockEnd: {
        end: 'B',
        joint: 'bFxUK9cEK',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: 100,
        y: 0,
        z: -45,
        dirXZ: 0
      }
    },
    {
      id: 'rYCoBojTw',
      type: 'Section',
      trainCount: 0,
      permanentDirection: false,
      isFreeA: true,
      isFreeB: true,
      startBlockJointEnd: {
        joint: 'SWnAOGvlG',
        end: 'B'
      },
      endBlockJointEnd: {
        joint: 'HsC02XoHV',
        end: 'A'
      },
      rayA: {
        x: 117.81072749815596,
        y: 0,
        z: 119.35793246789922,
        dirXZ: -0.437636684610304
      },
      rayB: {
        x: 22.5,
        y: 0,
        z: 140,
        dirXZ: 1.5707963267948966
      }
    },
    {
      id: 'CQYBN_IEM',
      type: 'Section',
      trainCount: 0,
      permanentDirection: false,
      isFreeA: true,
      isFreeB: true,
      startBlockJointEnd: {
        joint: 'e68HwcqSZ',
        end: 'A'
      },
      endBlockJointEnd: {
        joint: 'oo7XtSIH5',
        end: 'B'
      },
      rayA: {
        x: -37.16865996605516,
        y: 0,
        z: 59.35793246789921,
        dirXZ: -0.48899925848548925
      },
      rayB: {
        x: -24.357932467899207,
        y: 0,
        z: 134.84624438118112,
        dirXZ: -2.1934327390782906
      }
    },
    {
      id: '63FpN344g',
      type: 'Section',
      trainCount: 0,
      permanentDirection: false,
      isFreeA: true,
      isFreeB: true,
      startBlockJointEnd: {
        joint: 'Pwa4LHeoM',
        end: 'B'
      },
      endBlockJointEnd: {
        joint: 'hx6LXzhjC',
        end: 'A'
      },
      rayA: {
        x: -17.168659966055152,
        y: 0,
        z: 120.64206753210077,
        dirXZ: -2.6525933951043044
      },
      rayB: {
        x: -20,
        y: 0,
        z: 62.5,
        dirXZ: 0
      }
    },
    {
      id: 'fIaxvthC2',
      type: 'Section',
      trainCount: 0,
      permanentDirection: false,
      isFreeA: true,
      isFreeB: true,
      startBlockJointEnd: {
        joint: 'o23zwHMj6',
        end: 'B'
      },
      endBlockJointEnd: {
        joint: 'pBNExBjO8',
        end: 'A'
      },
      rayA: {
        x: -20,
        y: 0,
        z: 20,
        dirXZ: 3.141592653589793
      },
      rayB: {
        x: -17.168659966055152,
        y: 0,
        z: -20.642067532100793,
        dirXZ: -0.48899925848548925
      }
    },
    {
      id: '2NWoWf7k1',
      type: 'Section',
      trainCount: 0,
      permanentDirection: false,
      isFreeA: true,
      isFreeB: true,
      startBlockJointEnd: {
        joint: 'Onr7hTULW',
        end: 'B'
      },
      endBlockJointEnd: {
        joint: '2c8E3hpUy',
        end: 'A'
      },
      rayA: {
        x: 115.68215152454256,
        y: 0,
        z: 16.85793246789921,
        dirXZ: 0.58135260995361
      },
      rayB: {
        x: 120,
        y: 0,
        z: 80,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: '0LQUkXDEu',
      type: 'Section',
      trainCount: 0,
      permanentDirection: false,
      isFreeA: true,
      isFreeB: true,
      startBlockJointEnd: {
        joint: '_Ez6nYmP8',
        end: 'A'
      },
      endBlockJointEnd: {
        joint: '7TBO_wlM4',
        end: 'A'
      },
      rayA: {
        x: 104.31784847545745,
        y: 0,
        z: 83.14206753210078,
        dirXZ: -2.560240043636183
      },
      rayB: {
        x: 100,
        y: 0,
        z: 20,
        dirXZ: 0
      }
    },
    {
      id: '9b8ZvfYf7i',
      type: 'Signal',
      signal: 'Green',
      hidden: false,
      ray: {
        x: -20,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'tYnNTUUbl1',
        direction: 'AB',
        position: 0
      },
      blockEnd: {
        end: 'A',
        joint: 't1HLNipW_',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: 'g*EhhVHmgT',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: -14.375,
        y: 0,
        z: -84.99999999999999,
        dirXZ: -2.498091544796509
      },
      positionOnTrack: {
        trackId: 'Q24Vnk6Wak',
        direction: 'BA',
        position: 5.736665307264744
      },
      blockEnd: {
        end: 'B',
        joint: '6qAPGG9Xs',
        signal: 'Green',
        hidden: true
      }
    },
    {
      id: '3nVtbliMUT',
      type: 'Signal',
      signal: 'Green',
      hidden: false,
      ray: {
        x: 0,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'mjbjKS18CB',
        direction: 'AB',
        position: 0
      },
      blockEnd: {
        end: 'A',
        joint: 'V_3skoULl',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: 'cnVucHQhvd',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: 0,
        y: 0,
        z: -87.5,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: 'Cb21H5BwOK',
        direction: 'BA',
        position: 7.5
      },
      blockEnd: {
        end: 'B',
        joint: 'rJlImUX8u',
        signal: 'Green',
        hidden: true
      }
    },
    {
      id: 'fG0Wk_AMv6',
      type: 'Signal',
      signal: 'Green',
      hidden: false,
      ray: {
        x: 10,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: '5dYWK2K308',
        direction: 'AB',
        position: 0
      },
      blockEnd: {
        end: 'A',
        joint: 'msWxgzAEj',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: 'DH4Oc6TrPC',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: 10,
        y: 0,
        z: -87.5,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: 'BP*v9PfQrw',
        direction: 'BA',
        position: 7.5
      },
      blockEnd: {
        end: 'B',
        joint: 'OhxYqANm7',
        signal: 'Green',
        hidden: true
      }
    },
    {
      id: 'HaiDjZZ0Mz',
      type: 'Signal',
      signal: 'Green',
      hidden: false,
      ray: {
        x: 30,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: '5NRfqzqajW',
        direction: 'AB',
        position: 0
      },
      blockEnd: {
        end: 'A',
        joint: '_hV00cNZJ',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: 'xxtfNA_96G',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: 24.375,
        y: 0,
        z: -84.99999999999999,
        dirXZ: 2.498091544796509
      },
      positionOnTrack: {
        trackId: '652lnQOGka',
        direction: 'BA',
        position: 5.736665307264744
      },
      blockEnd: {
        end: 'B',
        joint: 'uKawu36JF',
        signal: 'Green',
        hidden: true
      }
    },
    {
      id: 'zr2I0Shj5T',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: 24.375,
        y: 0,
        z: -85,
        dirXZ: -0.6435011087932845
      },
      positionOnTrack: {
        trackId: '652lnQOGka',
        direction: 'AB',
        position: 17.209995921794217
      },
      blockEnd: {
        end: 'A',
        joint: 'uKawu36JF',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'HUNr3WRy9u',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: 10,
        y: 0,
        z: -87.5,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'BP*v9PfQrw',
        direction: 'AB',
        position: 12.5
      },
      blockEnd: {
        end: 'A',
        joint: 'OhxYqANm7',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'HDZ82QroYt',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: 0,
        y: 0,
        z: -87.5,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'Cb21H5BwOK',
        direction: 'AB',
        position: 12.5
      },
      blockEnd: {
        end: 'A',
        joint: 'rJlImUX8u',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'GUyQLVoCpN',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: -14.374999999999998,
        y: 0,
        z: -85,
        dirXZ: 0.6435011087932845
      },
      positionOnTrack: {
        trackId: 'Q24Vnk6Wak',
        direction: 'AB',
        position: 17.209995921794217
      },
      blockEnd: {
        end: 'A',
        joint: '6qAPGG9Xs',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: '86LViGhWLa',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: -14.375000000000004,
        y: 0,
        z: -25,
        dirXZ: 2.498091544796509
      },
      positionOnTrack: {
        trackId: 'euZWN5I34S',
        direction: 'BA',
        position: 17.209995921794214
      },
      blockEnd: {
        end: 'B',
        joint: 'pBNExBjO8',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: '6Xy11F7b3F',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: -14.375,
        y: 0,
        z: -25,
        dirXZ: -0.6435011087932845
      },
      positionOnTrack: {
        trackId: 'euZWN5I34S',
        direction: 'AB',
        position: 5.73666530726474
      },
      blockEnd: {
        end: 'A',
        joint: 'pBNExBjO8',
        signal: 'Green',
        hidden: true
      },
      sectionEnd: {
        end: 'A',
        joint: 'pBNExBjO8',
        signal: 'Green'
      }
    },
    {
      id: 'CPbAxzlhuC',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: -20,
        y: 0,
        z: 25,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: 'e86W1EWH7x',
        direction: 'BA',
        position: 5
      },
      blockEnd: {
        end: 'B',
        joint: 'o23zwHMj6',
        signal: 'Green',
        hidden: true
      },
      sectionEnd: {
        end: 'B',
        joint: 'o23zwHMj6',
        signal: 'Green'
      }
    },
    {
      id: 'zmuAWSWBsa',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: -20,
        y: 0,
        z: 25,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'e86W1EWH7x',
        direction: 'AB',
        position: 15
      },
      blockEnd: {
        end: 'A',
        joint: 'o23zwHMj6',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'Rggbm5uFM6',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: -34.37500000000001,
        y: 0,
        z: 55.00000000000001,
        dirXZ: 2.498091544796509
      },
      positionOnTrack: {
        trackId: 'K4LnfjqsEM',
        direction: 'BA',
        position: 17.209995921794214
      },
      blockEnd: {
        end: 'B',
        joint: 'e68HwcqSZ',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: '0gk2OYhH9I',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: -20,
        y: 0,
        z: 57.5,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: 'oZSI*kEu3c',
        direction: 'BA',
        position: 12.5
      },
      blockEnd: {
        end: 'B',
        joint: 'hx6LXzhjC',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'VOhAV4osvj',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: -34.375,
        y: 0,
        z: 55,
        dirXZ: -0.6435011087932845
      },
      positionOnTrack: {
        trackId: 'K4LnfjqsEM',
        direction: 'AB',
        position: 5.73666530726474
      },
      blockEnd: {
        end: 'A',
        joint: 'e68HwcqSZ',
        signal: 'Green',
        hidden: true
      },
      sectionEnd: {
        end: 'A',
        joint: 'e68HwcqSZ',
        signal: 'Green'
      }
    },
    {
      id: 'KrMPtH*KUc',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: -19.999999999999996,
        y: 0,
        z: 137.5,
        dirXZ: -2.0344439357957027
      },
      positionOnTrack: {
        trackId: 'LDnPaGY3fx',
        direction: 'BA',
        position: 11.473330614529473
      },
      blockEnd: {
        end: 'B',
        joint: 'oo7XtSIH5',
        signal: 'Green',
        hidden: true
      },
      sectionEnd: {
        end: 'B',
        joint: 'oo7XtSIH5',
        signal: 'Green'
      }
    },
    {
      id: 'R8zC0pwPhD',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: -20,
        y: 0,
        z: 57.5,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'oZSI*kEu3c',
        direction: 'AB',
        position: 7.5
      },
      blockEnd: {
        end: 'A',
        joint: 'hx6LXzhjC',
        signal: 'Green',
        hidden: true
      },
      sectionEnd: {
        end: 'A',
        joint: 'hx6LXzhjC',
        signal: 'Green'
      }
    },
    {
      id: 'Y*WI0j*bBC',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: -14.375,
        y: 0,
        z: 124.99999999999999,
        dirXZ: -2.4980915447965093
      },
      positionOnTrack: {
        trackId: '01ZRRy0xph',
        direction: 'BA',
        position: 5.736665307264744
      },
      blockEnd: {
        end: 'B',
        joint: 'Pwa4LHeoM',
        signal: 'Green',
        hidden: true
      },
      sectionEnd: {
        end: 'B',
        joint: 'Pwa4LHeoM',
        signal: 'Green'
      }
    },
    {
      id: 'vFv0eHwWhy',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: -14.374999999999998,
        y: 0,
        z: 125,
        dirXZ: 0.643501108793284
      },
      positionOnTrack: {
        trackId: '01ZRRy0xph',
        direction: 'AB',
        position: 17.209995921794217
      },
      blockEnd: {
        end: 'A',
        joint: 'Pwa4LHeoM',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'FwEfjks1EB',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: -20,
        y: 0,
        z: 137.5,
        dirXZ: 1.1071487177940904
      },
      positionOnTrack: {
        trackId: 'LDnPaGY3fx',
        direction: 'AB',
        position: 11.47333061452948
      },
      blockEnd: {
        end: 'A',
        joint: 'oo7XtSIH5',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'XxNgzHrHOD',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: 17.5,
        y: 0,
        z: 140,
        dirXZ: -1.5707963267948966
      },
      positionOnTrack: {
        trackId: 'IUlgO66hli',
        direction: 'BA',
        position: 12.5
      },
      blockEnd: {
        end: 'B',
        joint: 'HsC02XoHV',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'QEwIl5gzB*',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: 17.5,
        y: 0,
        z: 140,
        dirXZ: 1.5707963267948966
      },
      positionOnTrack: {
        trackId: 'IUlgO66hli',
        direction: 'AB',
        position: 7.5
      },
      blockEnd: {
        end: 'A',
        joint: 'HsC02XoHV',
        signal: 'Green',
        hidden: true
      },
      sectionEnd: {
        end: 'A',
        joint: 'HsC02XoHV',
        signal: 'Green'
      }
    },
    {
      id: 'wb_VwMr93P',
      type: 'Signal',
      signal: 'Green',
      hidden: false,
      ray: {
        x: 72.5,
        y: 0,
        z: 140,
        dirXZ: -1.5707963267948966
      },
      positionOnTrack: {
        trackId: 'FYuVYbZDlv',
        direction: 'BA',
        position: 17.5
      },
      blockEnd: {
        end: 'B',
        joint: 'ZbkMSfzo_',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: 'b3tnhLU1HN',
      type: 'Signal',
      signal: 'Green',
      hidden: false,
      ray: {
        x: 72.5,
        y: 0,
        z: 140,
        dirXZ: 1.5707963267948966
      },
      positionOnTrack: {
        trackId: 'FYuVYbZDlv',
        direction: 'AB',
        position: 2.5
      },
      blockEnd: {
        end: 'A',
        joint: 'ZbkMSfzo_',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: 'hPNYjKn0_M',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: 119.375,
        y: 0,
        z: 115,
        dirXZ: -0.24497866312686448
      },
      positionOnTrack: {
        trackId: 'nt2*HCihkQ',
        direction: 'BA',
        position: 5.736665307264733
      },
      blockEnd: {
        end: 'B',
        joint: 'SWnAOGvlG',
        signal: 'Green',
        hidden: true
      },
      sectionEnd: {
        end: 'B',
        joint: 'SWnAOGvlG',
        signal: 'Green'
      }
    },
    {
      id: 'K75vy8Xux0',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: 119.375,
        y: 0,
        z: 115,
        dirXZ: 2.8966139904629284
      },
      positionOnTrack: {
        trackId: 'nt2*HCihkQ',
        direction: 'AB',
        position: 17.20999592179422
      },
      blockEnd: {
        end: 'A',
        joint: 'SWnAOGvlG',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'sKMpsLY45H',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: 120,
        y: 0,
        z: 85,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'RjJQdOSaoM',
        direction: 'BA',
        position: 15
      },
      blockEnd: {
        end: 'B',
        joint: '2c8E3hpUy',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: '8hW89qtlCE',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: 107.65625,
        y: 0,
        z: 87.5,
        dirXZ: 0.7188299996216244
      },
      positionOnTrack: {
        trackId: 'YctvefyM3f',
        direction: 'BA',
        position: 20.078328575426582
      },
      blockEnd: {
        end: 'B',
        joint: '_Ez6nYmP8',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'yWaEw8yL5o',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: 107.65625,
        y: 0,
        z: 87.5,
        dirXZ: -2.4227626539681686
      },
      positionOnTrack: {
        trackId: 'YctvefyM3f',
        direction: 'AB',
        position: 2.86833265363237
      },
      blockEnd: {
        end: 'A',
        joint: '_Ez6nYmP8',
        signal: 'Green',
        hidden: true
      },
      sectionEnd: {
        end: 'A',
        joint: '_Ez6nYmP8',
        signal: 'Green'
      }
    },
    {
      id: 'xe2wJ*Pjyh',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: 100,
        y: 0,
        z: 15,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'MTNAZC79J',
        direction: 'AB',
        position: 5
      },
      blockEnd: {
        end: 'A',
        joint: '7TBO_wlM4',
        signal: 'Green',
        hidden: true
      },
      sectionEnd: {
        end: 'A',
        joint: '7TBO_wlM4',
        signal: 'Green'
      }
    },
    {
      id: 'DlvFI50*B_',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: 120,
        y: 0,
        z: 85,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: 'RjJQdOSaoM',
        direction: 'AB',
        position: 5
      },
      blockEnd: {
        end: 'A',
        joint: '2c8E3hpUy',
        signal: 'Green',
        hidden: true
      },
      sectionEnd: {
        end: 'A',
        joint: '2c8E3hpUy',
        signal: 'Green'
      }
    },
    {
      id: 'Wpi*J9zg8B',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: 112.34374999999999,
        y: 0,
        z: 12.5,
        dirXZ: 0.7188299996216243
      },
      positionOnTrack: {
        trackId: 'EfODpYVvww',
        direction: 'BA',
        position: 2.868332653632372
      },
      blockEnd: {
        end: 'B',
        joint: 'Onr7hTULW',
        signal: 'Green',
        hidden: true
      },
      sectionEnd: {
        end: 'B',
        joint: 'Onr7hTULW',
        signal: 'Green'
      }
    },
    {
      id: '4OqaDLTxI5',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: 112.34375,
        y: 0,
        z: 12.499999999999998,
        dirXZ: -2.4227626539681686
      },
      positionOnTrack: {
        trackId: 'EfODpYVvww',
        direction: 'AB',
        position: 20.07832857542659
      },
      blockEnd: {
        end: 'A',
        joint: 'Onr7hTULW',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'E0pg4pTjzv',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: 100,
        y: 0,
        z: 15,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: 'MTNAZC79J',
        direction: 'BA',
        position: 15
      },
      blockEnd: {
        end: 'B',
        joint: '7TBO_wlM4',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'kyFllEC2Lb',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: 100,
        y: 0,
        z: -15,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: '_8MryH*RNL',
        direction: 'BA',
        position: 15
      },
      blockEnd: {
        end: 'B',
        joint: 'bFxUK9cEK',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'hIRPeLZl0l',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: 100,
        y: 0,
        z: -15,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: '_8MryH*RNL',
        direction: 'AB',
        position: 5
      },
      blockEnd: {
        end: 'A',
        joint: 'bFxUK9cEK',
        signal: 'Green',
        hidden: true
      }
    },
    {
      id: '6kBrPqxfqL',
      type: 'Signal',
      signal: 'Green',
      hidden: false,
      ray: {
        x: 100,
        y: 0,
        z: -90,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'M7Zhwz1a0h',
        direction: 'BA',
        position: 0
      },
      blockEnd: {
        end: 'B',
        joint: '8fypR3HZo',
        signal: 'Green',
        hidden: false
      }
    }
  ],
  camera: {
    alpha: 0.037499999999948554,
    beta: 0.8458333333333252,
    radius: 250.82265599999766,
    target: {
      x: 72.05724664937132,
      y: 0,
      z: 6.590169027036963
    },
    position: {
      x: 259.6720208506637,
      y: 166.32244527245362,
      z: 13.629022831662748
    }
  },
  _version: 2,
  _format: 'fahrplan'
};
