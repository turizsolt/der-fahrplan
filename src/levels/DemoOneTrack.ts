export const DEMO_ONE_TRACK = {
  data: [
    {
      id: '6hWJ1huVm',
      circle: {
        x: -25,
        y: 0,
        z: -120,
        r: 40.311288741492746
      },
      type: 'Station',
      name: 'Fairdeer'
    },
    {
      id: 'r_07_S3Df',
      circle: {
        x: -25,
        y: 0,
        z: 20,
        r: 32.01562118716424
      },
      type: 'Station',
      name: 'Urley'
    },
    {
      id: 'RhZADLRRh',
      circle: {
        x: 60,
        y: 0,
        z: 85,
        r: 25
      },
      type: 'Station',
      name: 'Pondley'
    },
    {
      id: 'KXl_2Rt2B',
      type: 'RouteStop',
      station: 'r_07_S3Df',
      departureTime: 300
    },
    {
      id: '28C7wk8VK',
      type: 'RouteStop',
      station: '6hWJ1huVm',
      departureTime: 0
    },
    {
      id: 'SC5uA1oR24',
      type: 'RouteStop',
      station: 'RhZADLRRh',
      arrivalTime: 600
    },
    {
      id: 'juEqC7SW10',
      type: 'RouteStop',
      station: 'RhZADLRRh',
      departureTime: 0
    },
    {
      id: 'PahGb0f0nR',
      type: 'RouteStop',
      station: '6hWJ1huVm',
      arrivalTime: 600,
      departureTime: 300
    },
    {
      id: 'lfVIl75E4K',
      type: 'RouteStop',
      station: 'r_07_S3Df',
      departureTime: 300
    },
    {
      id: '_ivlKAREO',
      type: 'Route',
      name: '1',
      detailedName: 'Fairdeer>>Pondley',
      stops: ['28C7wk8VK', 'KXl_2Rt2B', 'SC5uA1oR24']
    },
    {
      id: 'BhpGW4RIN',
      type: 'Route',
      name: '1V',
      detailedName: 'Pondley>>Fairdeer',
      stops: ['juEqC7SW10', 'lfVIl75E4K', 'PahGb0f0nR']
    },
    {
      id: '_RK*VS17g',
      type: 'Trip',
      route: '_ivlKAREO',
      departureTime: 0,
      prevTrip: 'Hj64JYlf9',
      nextTrip: 'Hj64JYlf9',
      redefinedProps: {}
    },
    {
      id: 'tOeBi7aab',
      type: 'Trip',
      route: '_ivlKAREO',
      departureTime: 300,
      prevTrip: '6zCWB0zOG',
      nextTrip: '6zCWB0zOG',
      redefinedProps: {}
    },
    {
      id: 'dAn9PyfzA',
      type: 'Trip',
      route: '_ivlKAREO',
      departureTime: 600,
      prevTrip: 'OS_5_13nB',
      nextTrip: 'OS_5_13nB',
      redefinedProps: {}
    },
    {
      id: 'OQHDWmy*e',
      type: 'Trip',
      route: '_ivlKAREO',
      departureTime: 900,
      prevTrip: 'EUeArkEuW',
      nextTrip: 'EUeArkEuW',
      redefinedProps: {}
    },
    {
      id: 'Hj64JYlf9',
      type: 'Trip',
      route: 'BhpGW4RIN',
      departureTime: 0,
      prevTrip: '_RK*VS17g',
      nextTrip: '_RK*VS17g',
      redefinedProps: {}
    },
    {
      id: '6zCWB0zOG',
      type: 'Trip',
      route: 'BhpGW4RIN',
      departureTime: 300,
      prevTrip: 'tOeBi7aab',
      nextTrip: 'tOeBi7aab',
      redefinedProps: {}
    },
    {
      id: 'OS_5_13nB',
      type: 'Trip',
      route: 'BhpGW4RIN',
      departureTime: 600,
      prevTrip: 'dAn9PyfzA',
      nextTrip: 'dAn9PyfzA',
      redefinedProps: {}
    },
    {
      id: 'EUeArkEuW',
      type: 'Trip',
      route: 'BhpGW4RIN',
      departureTime: 900,
      prevTrip: 'OQHDWmy*e',
      nextTrip: 'OQHDWmy*e',
      redefinedProps: {}
    },
    {
      id: 'plWSZeomdO',
      type: 'TrackJoint',
      ray: {
        x: -30,
        y: 0,
        z: -140,
        dirXZ: 0
      }
    },
    {
      id: '9QE5PbK7xY',
      type: 'TrackJoint',
      ray: {
        x: -30,
        y: 0,
        z: -100,
        dirXZ: 0
      }
    },
    {
      id: 'aMiISX79mg',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: -140,
        dirXZ: 0
      }
    },
    {
      id: 'phJrTAjyo8',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: -100,
        dirXZ: 0
      }
    },
    {
      id: 'ZmShoWeyek',
      type: 'TrackJoint',
      ray: {
        x: 0,
        y: 0,
        z: -140,
        dirXZ: 0
      }
    },
    {
      id: 'Xj5Eh7l75S',
      type: 'TrackJoint',
      ray: {
        x: 0,
        y: 0,
        z: -100,
        dirXZ: 0
      }
    },
    {
      id: 'vBLFAfO8mQ',
      type: 'TrackJoint',
      ray: {
        x: -50,
        y: 0,
        z: -140,
        dirXZ: 0
      }
    },
    {
      id: '9XzYByfdc_',
      type: 'TrackJoint',
      ray: {
        x: -50,
        y: 0,
        z: -100,
        dirXZ: 0
      }
    },
    {
      id: 'VwdzAV72lr',
      type: 'TrackJoint',
      ray: {
        x: -10,
        y: 0,
        z: -80,
        dirXZ: 2.356194490192345
      }
    },
    {
      id: 'wst3FMuHnd',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: -60,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'MWJWyjnHxJ',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: -80,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'A7iJjcaWH4',
      type: 'TrackJoint',
      ray: {
        x: -30,
        y: 0,
        z: -80,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: '3ykBHP9CYp',
      type: 'TrackJoint',
      ray: {
        x: -30,
        y: 0,
        z: -60,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'OrMUb1XZOh',
      type: 'TrackJoint',
      ray: {
        x: -40,
        y: 0,
        z: -80,
        dirXZ: -2.356194490192345
      }
    },
    {
      id: 'sGv2o8mVtk',
      type: 'TrackJoint',
      ray: {
        x: -25,
        y: 0,
        z: -50,
        dirXZ: 0.7853981633974483
      }
    },
    {
      id: '*hnWizUpVd',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: -40,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'wSsa8UYX9S',
      type: 'TrackJoint',
      ray: {
        x: -25,
        y: 0,
        z: -30,
        dirXZ: -0.7853981633974483
      }
    },
    {
      id: 'CTZDMAzJdX',
      type: 'TrackJoint',
      ray: {
        x: -30,
        y: 0,
        z: -20,
        dirXZ: 0
      }
    },
    {
      id: 'BYXdlhj39a',
      type: 'TrackJoint',
      ray: {
        x: -30,
        y: 0,
        z: -40,
        dirXZ: 0
      }
    },
    {
      id: 'dqqJbjQXEy',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: -20,
        dirXZ: 0
      }
    },
    {
      id: 'ZP_1*oNk_c',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: 0,
        dirXZ: 0
      }
    },
    {
      id: 'zT2NgmDVcu',
      type: 'TrackJoint',
      ray: {
        x: -20,
        y: 0,
        z: 40,
        dirXZ: 0
      }
    },
    {
      id: 'IgnTpvyBZm',
      type: 'TrackJoint',
      ray: {
        x: -30,
        y: 0,
        z: 0,
        dirXZ: 0
      }
    },
    {
      id: '7xQoaYMMFA',
      type: 'TrackJoint',
      ray: {
        x: -30,
        y: 0,
        z: 40,
        dirXZ: 0
      }
    },
    {
      id: '_aiO1*9H1e',
      type: 'TrackJoint',
      ray: {
        x: 20,
        y: 0,
        z: 80,
        dirXZ: 1.5707963267948966
      }
    },
    {
      id: 'h1ImvG83uz',
      type: 'TrackJoint',
      ray: {
        x: 20,
        y: 0,
        z: 90,
        dirXZ: 1.5707963267948966
      }
    },
    {
      id: 'BnZ4Y2zvOJ',
      type: 'TrackJoint',
      ray: {
        x: 30,
        y: 0,
        z: 85,
        dirXZ: -2.356194490192345
      }
    },
    {
      id: 'y51bA8sNEY',
      type: 'TrackJoint',
      ray: {
        x: 40,
        y: 0,
        z: 90,
        dirXZ: -1.5707963267948966
      }
    },
    {
      id: 'gaFd*IovA2',
      type: 'TrackJoint',
      ray: {
        x: 80,
        y: 0,
        z: 90,
        dirXZ: -1.5707963267948966
      }
    },
    {
      id: 'EqrxUS1J3q',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'plWSZeomdO'
        },
        endJointEnd: {
          end: 'A',
          joint: '9QE5PbK7xY'
        },
        coordinates: [
          {
            x: -30,
            y: 0,
            z: -140
          },
          {
            x: -30,
            y: 0,
            z: -100
          }
        ]
      }
    },
    {
      id: 'ilHSQ4_C8t',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'aMiISX79mg'
        },
        endJointEnd: {
          end: 'A',
          joint: 'phJrTAjyo8'
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
      id: 'n8iosmnyms',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'ZmShoWeyek'
        },
        endJointEnd: {
          end: 'A',
          joint: 'Xj5Eh7l75S'
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
      id: 'l8TJWGeI*z',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'vBLFAfO8mQ'
        },
        endJointEnd: {
          end: 'A',
          joint: '9XzYByfdc_'
        },
        coordinates: [
          {
            x: -50,
            y: 0,
            z: -140
          },
          {
            x: -50,
            y: 0,
            z: -100
          }
        ]
      }
    },
    {
      id: 'e232Wsy0Ho',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'Xj5Eh7l75S'
        },
        endJointEnd: {
          end: 'B',
          joint: 'VwdzAV72lr'
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
      id: 's2SCEk8K_',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'MWJWyjnHxJ'
        },
        endJointEnd: {
          end: 'B',
          joint: 'phJrTAjyo8'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: -80
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
      id: '3VorKxL8EZ',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: '9QE5PbK7xY'
        },
        endJointEnd: {
          end: 'B',
          joint: 'A7iJjcaWH4'
        },
        coordinates: [
          {
            x: -30,
            y: 0,
            z: -100
          },
          {
            x: -30,
            y: 0,
            z: -80
          }
        ]
      }
    },
    {
      id: 'mUHB5nh*t',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'OrMUb1XZOh'
        },
        endJointEnd: {
          end: 'B',
          joint: '9XzYByfdc_'
        },
        coordinates: [
          {
            x: -40,
            y: 0,
            z: -80
          },
          {
            x: -50,
            y: 0,
            z: -90
          },
          {
            x: -50,
            y: 0,
            z: -100
          }
        ]
      }
    },
    {
      id: 'zEmMBFZL*6',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'dqqJbjQXEy'
        },
        endJointEnd: {
          end: 'A',
          joint: 'ZP_1*oNk_c'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: -20
          },
          {
            x: -20,
            y: 0,
            z: 0
          }
        ]
      }
    },
    {
      id: 'joMKvKTieg',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'ZP_1*oNk_c'
        },
        endJointEnd: {
          end: 'A',
          joint: 'zT2NgmDVcu'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: 0
          },
          {
            x: -20,
            y: 0,
            z: 40
          }
        ]
      }
    },
    {
      id: 'K6mAjp*F19',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'CTZDMAzJdX'
        },
        endJointEnd: {
          end: 'A',
          joint: 'IgnTpvyBZm'
        },
        coordinates: [
          {
            x: -30,
            y: 0,
            z: -20
          },
          {
            x: -30,
            y: 0,
            z: 0
          }
        ]
      }
    },
    {
      id: 'd5aLjjMCgQ',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'IgnTpvyBZm'
        },
        endJointEnd: {
          end: 'A',
          joint: '7xQoaYMMFA'
        },
        coordinates: [
          {
            x: -30,
            y: 0,
            z: 0
          },
          {
            x: -30,
            y: 0,
            z: 40
          }
        ]
      }
    },
    {
      id: 'hksLRfwbb3',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'zT2NgmDVcu'
        },
        endJointEnd: {
          end: 'A',
          joint: '_aiO1*9H1e'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: 40
          },
          {
            x: -20,
            y: 0,
            z: 80
          },
          {
            x: 20,
            y: 0,
            z: 80
          }
        ]
      }
    },
    {
      id: 'PCCzXLyeh3',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: '7xQoaYMMFA'
        },
        endJointEnd: {
          end: 'A',
          joint: 'h1ImvG83uz'
        },
        coordinates: [
          {
            x: -30,
            y: 0,
            z: 40
          },
          {
            x: -30,
            y: 0,
            z: 90
          },
          {
            x: 20,
            y: 0,
            z: 90
          }
        ]
      }
    },
    {
      id: 'I2fQPlChVO',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: '_aiO1*9H1e'
        },
        endJointEnd: {
          end: 'B',
          joint: 'BnZ4Y2zvOJ'
        },
        coordinates: [
          {
            x: 20,
            y: 0,
            z: 80
          },
          {
            x: 25,
            y: 0,
            z: 80
          },
          {
            x: 30,
            y: 0,
            z: 85
          }
        ]
      }
    },
    {
      id: 'We0DHYHztC',
      type: 'Track',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'y51bA8sNEY'
        },
        endJointEnd: {
          end: 'B',
          joint: 'gaFd*IovA2'
        },
        coordinates: [
          {
            x: 40,
            y: 0,
            z: 90
          },
          {
            x: 120,
            y: 0,
            z: 90
          }
        ]
      }
    },
    {
      id: 'pzJxvaGcfS',
      type: 'TrackSwitch',
      segmentLeftData: {
        startJointEnd: {
          end: 'B',
          joint: 'wst3FMuHnd'
        },
        endJointEnd: {
          end: 'A',
          joint: 'VwdzAV72lr'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: -60
          },
          {
            x: -20,
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
      segmentRightData: {
        startJointEnd: {
          end: 'B',
          joint: 'wst3FMuHnd'
        },
        endJointEnd: {
          end: 'A',
          joint: 'MWJWyjnHxJ'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: -60
          },
          {
            x: -20,
            y: 0,
            z: -80
          }
        ]
      },
      state: 0,
      isLocked: false
    },
    {
      id: 'RoaEmAsgYz',
      type: 'TrackSwitch',
      segmentLeftData: {
        startJointEnd: {
          end: 'B',
          joint: '3ykBHP9CYp'
        },
        endJointEnd: {
          end: 'A',
          joint: 'A7iJjcaWH4'
        },
        coordinates: [
          {
            x: -30,
            y: 0,
            z: -60
          },
          {
            x: -30,
            y: 0,
            z: -80
          }
        ]
      },
      segmentRightData: {
        startJointEnd: {
          end: 'B',
          joint: '3ykBHP9CYp'
        },
        endJointEnd: {
          end: 'A',
          joint: 'OrMUb1XZOh'
        },
        coordinates: [
          {
            x: -30,
            y: 0,
            z: -60
          },
          {
            x: -30,
            y: 0,
            z: -70
          },
          {
            x: -40,
            y: 0,
            z: -80
          }
        ]
      },
      state: 0,
      isLocked: false
    },
    {
      id: 'AGhNhoKQL2',
      type: 'TrackSwitch',
      segmentLeftData: {
        startJointEnd: {
          end: 'A',
          joint: 'CTZDMAzJdX'
        },
        endJointEnd: {
          end: 'B',
          joint: 'wSsa8UYX9S'
        },
        coordinates: [
          {
            x: -30,
            y: 0,
            z: -20
          },
          {
            x: -30,
            y: 0,
            z: -25.000000000000004
          },
          {
            x: -25,
            y: 0,
            z: -30
          }
        ]
      },
      segmentRightData: {
        startJointEnd: {
          end: 'A',
          joint: 'CTZDMAzJdX'
        },
        endJointEnd: {
          end: 'B',
          joint: 'BYXdlhj39a'
        },
        coordinates: [
          {
            x: -30,
            y: 0,
            z: -20
          },
          {
            x: -30,
            y: 0,
            z: -40
          }
        ]
      },
      state: 0,
      isLocked: false
    },
    {
      id: 'MlsMvIR*m',
      type: 'TrackSwitch',
      segmentLeftData: {
        startJointEnd: {
          end: 'A',
          joint: '3ykBHP9CYp'
        },
        endJointEnd: {
          end: 'A',
          joint: 'BYXdlhj39a'
        },
        coordinates: [
          {
            x: -30,
            y: 0,
            z: -60
          },
          {
            x: -30,
            y: 0,
            z: -40
          }
        ]
      },
      segmentRightData: {
        startJointEnd: {
          end: 'A',
          joint: '3ykBHP9CYp'
        },
        endJointEnd: {
          end: 'A',
          joint: 'sGv2o8mVtk'
        },
        coordinates: [
          {
            x: -30,
            y: 0,
            z: -60
          },
          {
            x: -30,
            y: 0,
            z: -55
          },
          {
            x: -25,
            y: 0,
            z: -50
          }
        ]
      },
      state: 0,
      isLocked: false
    },
    {
      id: '7VBwDca3k',
      type: 'TrackSwitch',
      segmentLeftData: {
        startJointEnd: {
          end: 'B',
          joint: '*hnWizUpVd'
        },
        endJointEnd: {
          end: 'A',
          joint: 'wst3FMuHnd'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: -40
          },
          {
            x: -20,
            y: 0,
            z: -60
          }
        ]
      },
      segmentRightData: {
        startJointEnd: {
          end: 'B',
          joint: '*hnWizUpVd'
        },
        endJointEnd: {
          end: 'B',
          joint: 'sGv2o8mVtk'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: -40
          },
          {
            x: -20,
            y: 0,
            z: -45
          },
          {
            x: -25,
            y: 0,
            z: -50
          }
        ]
      },
      state: 0,
      isLocked: false
    },
    {
      id: 'qT5sNBFUD4',
      type: 'TrackSwitch',
      segmentLeftData: {
        startJointEnd: {
          end: 'A',
          joint: '*hnWizUpVd'
        },
        endJointEnd: {
          end: 'A',
          joint: 'wSsa8UYX9S'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: -40
          },
          {
            x: -20,
            y: 0,
            z: -35.00000000000001
          },
          {
            x: -25,
            y: 0,
            z: -30
          }
        ]
      },
      segmentRightData: {
        startJointEnd: {
          end: 'A',
          joint: '*hnWizUpVd'
        },
        endJointEnd: {
          end: 'A',
          joint: 'dqqJbjQXEy'
        },
        coordinates: [
          {
            x: -20,
            y: 0,
            z: -40
          },
          {
            x: -20,
            y: 0,
            z: -20
          }
        ]
      },
      state: 0,
      isLocked: false
    },
    {
      id: 'dDUwTBlCa',
      type: 'TrackSwitch',
      segmentLeftData: {
        startJointEnd: {
          end: 'B',
          joint: 'y51bA8sNEY'
        },
        endJointEnd: {
          end: 'A',
          joint: 'BnZ4Y2zvOJ'
        },
        coordinates: [
          {
            x: 40,
            y: 0,
            z: 90
          },
          {
            x: 35,
            y: 0,
            z: 90
          },
          {
            x: 30,
            y: 0,
            z: 85
          }
        ]
      },
      segmentRightData: {
        startJointEnd: {
          end: 'B',
          joint: 'y51bA8sNEY'
        },
        endJointEnd: {
          end: 'B',
          joint: 'h1ImvG83uz'
        },
        coordinates: [
          {
            x: 40,
            y: 0,
            z: 90
          },
          {
            x: 20,
            y: 0,
            z: 90
          }
        ]
      },
      state: 0,
      isLocked: false
    },
    {
      id: 'dLns3t8zL',
      type: 'Platform',
      track: 'We0DHYHztC',
      start: 0.125,
      end: 0.875,
      side: 'Right',
      width: 7.5
    },
    {
      id: 'gislAkBz5',
      type: 'Platform',
      track: 'joMKvKTieg',
      start: 0.125,
      end: 0.875,
      side: 'Right',
      width: 7.5
    },
    {
      id: 'VtfW6WpqJ',
      type: 'Platform',
      track: 'd5aLjjMCgQ',
      start: 0.125,
      end: 0.875,
      side: 'Left',
      width: 7.5
    },
    {
      id: '93gm4AkXP',
      type: 'Platform',
      track: 'n8iosmnyms',
      start: 0.125,
      end: 0.875,
      side: 'Left',
      width: 7.5
    },
    {
      id: 'kAc0ZoyK3',
      type: 'Platform',
      track: 'ilHSQ4_C8t',
      start: 0.125,
      end: 0.875,
      side: 'Right',
      width: 7.5
    },
    {
      id: 'uwnaL0ErG',
      type: 'Platform',
      track: 'EqrxUS1J3q',
      start: 0.125,
      end: 0.875,
      side: 'Left',
      width: 7.5
    },
    {
      id: 'COhXCxZDO',
      type: 'Platform',
      track: 'l8TJWGeI*z',
      start: 0.125,
      end: 0.875,
      side: 'Right',
      width: 7.5
    },
    {
      id: 'DH_cKMUCp',
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
      id: 'RnILPsORs',
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
      id: 'ydPZb8_GZ',
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
      id: '7TweYVtqi',
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
      id: 'QxWN53uRmz',
      type: 'Train',
      autoMode: true,
      position: {
        trackId: 'n8iosmnyms',
        direction: 'AB',
        position: 15
      },
      speed: {
        speed: 0,
        shunting: false,
        pedal: 0
      },
      wagons: [
        {
          wagon: 'DH_cKMUCp',
          trip: 'OQHDWmy*e'
        }
      ],
      trips: ['OQHDWmy*e']
    },
    {
      id: 'IFTUlHjWA1',
      type: 'Train',
      autoMode: true,
      position: {
        trackId: 'EqrxUS1J3q',
        direction: 'AB',
        position: 15
      },
      speed: {
        speed: 0,
        shunting: false,
        pedal: 0
      },
      wagons: [
        {
          wagon: 'RnILPsORs',
          trip: 'tOeBi7aab'
        }
      ],
      trips: ['tOeBi7aab']
    },
    {
      id: 'mwbC31jDi5',
      type: 'Train',
      autoMode: true,
      position: {
        trackId: 'ilHSQ4_C8t',
        direction: 'AB',
        position: 15
      },
      speed: {
        speed: 0,
        shunting: false,
        pedal: 0
      },
      wagons: [
        {
          wagon: 'ydPZb8_GZ',
          trip: 'dAn9PyfzA'
        }
      ],
      trips: ['dAn9PyfzA']
    },
    {
      id: 'JrtJw1VMYy',
      type: 'Train',
      autoMode: true,
      position: {
        trackId: 'l8TJWGeI*z',
        direction: 'AB',
        position: 15
      },
      speed: {
        speed: 0,
        shunting: false,
        pedal: 0
      },
      wagons: [
        {
          wagon: '7TweYVtqi',
          trip: '_RK*VS17g'
        }
      ],
      trips: ['_RK*VS17g']
    },
    {
      id: '548r6INPx',
      type: 'BlockJoint',
      ray: {
        x: -30,
        y: 0,
        z: -82.5,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: '3VorKxL8EZ',
        direction: 'AB',
        position: 17.5
      }
    },
    {
      id: 'lAnEw8I69',
      type: 'BlockJoint',
      ray: {
        x: -20,
        y: 0,
        z: -82.5,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: 's2SCEk8K_',
        direction: 'AB',
        position: 2.5
      }
    },
    {
      id: 'bkmbSr*HO',
      type: 'BlockJoint',
      ray: {
        x: -7.65625,
        y: 0,
        z: -82.5,
        dirXZ: -0.7188299996216245
      },
      positionOnTrack: {
        trackId: 'e232Wsy0Ho',
        direction: 'AB',
        position: 20.078328575426585
      }
    },
    {
      id: 'xtXaozeKP',
      type: 'BlockJoint',
      ray: {
        x: -42.34375,
        y: 0,
        z: -82.5,
        dirXZ: -2.4227626539681686
      },
      positionOnTrack: {
        trackId: 'mUHB5nh*t',
        direction: 'AB',
        position: 2.86833265363237
      }
    },
    {
      id: 'qh1dAbAA6',
      type: 'BlockJoint',
      ray: {
        x: -50,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'l8TJWGeI*z',
        direction: 'AB',
        position: 0
      }
    },
    {
      id: '93pioTwTc',
      type: 'BlockJoint',
      ray: {
        x: -30,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'EqrxUS1J3q',
        direction: 'AB',
        position: 0
      }
    },
    {
      id: 'cHnEukiHT',
      type: 'BlockJoint',
      ray: {
        x: -20,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'ilHSQ4_C8t',
        direction: 'AB',
        position: 0
      }
    },
    {
      id: 'uFI6heoBv',
      type: 'BlockJoint',
      ray: {
        x: 0,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'n8iosmnyms',
        direction: 'AB',
        position: 0
      }
    },
    {
      id: 'Ocdv39BFY',
      type: 'BlockJoint',
      ray: {
        x: -20,
        y: 0,
        z: -17.5,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'zEmMBFZL*6',
        direction: 'AB',
        position: 2.5
      }
    },
    {
      id: 't_RB49pXB',
      type: 'BlockJoint',
      ray: {
        x: -30,
        y: 0,
        z: -17.5,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'K6mAjp*F19',
        direction: 'AB',
        position: 2.5
      }
    },
    {
      id: 'VulIF9e9G',
      type: 'BlockJoint',
      ray: {
        x: 10.625,
        y: 0,
        z: 79.375,
        dirXZ: 1.4288992721907328
      },
      positionOnTrack: {
        trackId: 'hksLRfwbb3',
        direction: 'AB',
        position: 56.72161322962444
      }
    },
    {
      id: 'lfIhXSjev',
      type: 'BlockJoint',
      ray: {
        x: 8.28125,
        y: 0,
        z: 89.21875,
        dirXZ: 1.4288992721907328
      },
      positionOnTrack: {
        trackId: 'PCCzXLyeh3',
        direction: 'AB',
        position: 70.90201653703053
      }
    },
    {
      id: 'viei8_tDu',
      type: 'BlockJoint',
      ray: {
        x: -19.375,
        y: 0,
        z: 49.375,
        dirXZ: 0.1418970546041639
      },
      positionOnTrack: {
        trackId: 'hksLRfwbb3',
        direction: 'AB',
        position: 8.103087604232062
      }
    },
    {
      id: 'Q0WyE_g9l',
      type: 'BlockJoint',
      ray: {
        x: -29.21875,
        y: 0,
        z: 51.71875,
        dirXZ: 0.1418970546041639
      },
      positionOnTrack: {
        trackId: 'PCCzXLyeh3',
        direction: 'AB',
        position: 10.128859505290077
      }
    },
    {
      id: 'WNcwsykxz',
      type: 'BlockJoint',
      ray: {
        x: 120,
        y: 0,
        z: 90,
        dirXZ: 1.5707963267948966
      },
      positionOnTrack: {
        trackId: 'We0DHYHztC',
        direction: 'AB',
        position: 80
      }
    },
    {
      id: 'JC3Jg412*',
      type: 'BlockJoint',
      ray: {
        x: 45,
        y: 0,
        z: 90,
        dirXZ: 1.5707963267948966
      },
      positionOnTrack: {
        trackId: 'We0DHYHztC',
        direction: 'AB',
        position: 5
      }
    },
    {
      id: 'YiCMlaHeU',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'WNcwsykxz',
          signal: 'Green',
          hidden: false
        },
        endJointEnd: {
          end: 'A',
          joint: 'JC3Jg412*',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: 120,
        y: 0,
        z: 90,
        dirXZ: 1.5707963267948966
      },
      rayB: {
        x: 45,
        y: 0,
        z: 90,
        dirXZ: 1.5707963267948966
      },
      coords: [
        {
          x: 45,
          y: 0,
          z: 90
        },
        {
          x: 50,
          y: 0,
          z: 90
        },
        {
          x: 60,
          y: 0,
          z: 90
        },
        {
          x: 70,
          y: 0,
          z: 90
        },
        {
          x: 80,
          y: 0,
          z: 90
        },
        {
          x: 90,
          y: 0,
          z: 90
        },
        {
          x: 100,
          y: 0,
          z: 90
        },
        {
          x: 110,
          y: 0,
          z: 90
        },
        {
          x: 120,
          y: 0,
          z: 90
        }
      ]
    },
    {
      id: 'X6kuacz6e',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'VulIF9e9G',
          signal: 'Green',
          hidden: true
        },
        endJointEnd: {
          end: 'A',
          joint: 'viei8_tDu',
          signal: 'Green',
          hidden: false
        }
      },
      isFree: true,
      rayA: {
        x: 10.625,
        y: 0,
        z: 79.375,
        dirXZ: 1.4288992721907328
      },
      rayB: {
        x: -19.375,
        y: 0,
        z: 49.375,
        dirXZ: 0.1418970546041639
      },
      coords: [
        {
          x: -19.375,
          y: 0,
          z: 49.375
        },
        {
          x: -19.375,
          y: 0,
          z: 49.375
        },
        {
          x: -19.375,
          y: 0,
          z: 49.375
        },
        {
          x: -17.5,
          y: 0,
          z: 57.5
        },
        {
          x: -14.375,
          y: 0,
          z: 64.375
        },
        {
          x: -10,
          y: 0,
          z: 70
        },
        {
          x: -4.375,
          y: 0,
          z: 74.375
        },
        {
          x: 2.5,
          y: 0,
          z: 77.5
        },
        {
          x: 10.625,
          y: 0,
          z: 79.375
        }
      ]
    },
    {
      id: 'lj_WT2dPO',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'Q0WyE_g9l',
          signal: 'Green',
          hidden: false
        },
        endJointEnd: {
          end: 'B',
          joint: 'lfIhXSjev',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: -29.21875,
        y: 0,
        z: 51.71875,
        dirXZ: 0.1418970546041639
      },
      rayB: {
        x: 8.28125,
        y: 0,
        z: 89.21875,
        dirXZ: 1.4288992721907328
      },
      coords: [
        {
          x: -29.21875,
          y: 0,
          z: 51.71875
        },
        {
          x: -29.21875,
          y: 0,
          z: 51.71875
        },
        {
          x: -29.21875,
          y: 0,
          z: 51.71875
        },
        {
          x: -26.875,
          y: 0,
          z: 61.875
        },
        {
          x: -22.96875,
          y: 0,
          z: 70.46875
        },
        {
          x: -17.5,
          y: 0,
          z: 77.5
        },
        {
          x: -10.46875,
          y: 0,
          z: 82.96875
        },
        {
          x: -1.875,
          y: 0,
          z: 86.875
        },
        {
          x: 8.28125,
          y: 0,
          z: 89.21875
        }
      ]
    },
    {
      id: 'f0GcCYZD6',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'viei8_tDu',
          signal: 'Green',
          hidden: false
        },
        endJointEnd: {
          end: 'A',
          joint: 'Ocdv39BFY',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: -19.375,
        y: 0,
        z: 49.375,
        dirXZ: 0.1418970546041639
      },
      rayB: {
        x: -20,
        y: 0,
        z: -17.5,
        dirXZ: 0
      },
      coords: [
        {
          x: -19.375,
          y: 0,
          z: 49.375
        },
        {
          x: -19.375,
          y: 0,
          z: 49.375
        },
        {
          x: -19.375,
          y: 0,
          z: 49.375
        },
        {
          x: -20,
          y: 0,
          z: 40
        },
        {
          x: -20,
          y: 0,
          z: 40
        },
        {
          x: -20,
          y: 0,
          z: 35
        },
        {
          x: -20,
          y: 0,
          z: 30
        },
        {
          x: -20,
          y: 0,
          z: 25
        },
        {
          x: -20,
          y: 0,
          z: 20
        },
        {
          x: -20,
          y: 0,
          z: 15
        },
        {
          x: -20,
          y: 0,
          z: 10
        },
        {
          x: -20,
          y: 0,
          z: 5
        },
        {
          x: -20,
          y: 0,
          z: 0
        },
        {
          x: -20,
          y: 0,
          z: 0
        },
        {
          x: -20,
          y: 0,
          z: -2.5
        },
        {
          x: -20,
          y: 0,
          z: -5
        },
        {
          x: -20,
          y: 0,
          z: -7.5
        },
        {
          x: -20,
          y: 0,
          z: -10
        },
        {
          x: -20,
          y: 0,
          z: -12.5
        },
        {
          x: -20,
          y: 0,
          z: -15
        },
        {
          x: -20,
          y: 0,
          z: -17.5
        }
      ]
    },
    {
      id: 'fQWxvSp4w',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'Q0WyE_g9l',
          signal: 'Green',
          hidden: false
        },
        endJointEnd: {
          end: 'A',
          joint: 't_RB49pXB',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: -29.21875,
        y: 0,
        z: 51.71875,
        dirXZ: 0.1418970546041639
      },
      rayB: {
        x: -30,
        y: 0,
        z: -17.5,
        dirXZ: 0
      },
      coords: [
        {
          x: -29.21875,
          y: 0,
          z: 51.71875
        },
        {
          x: -29.21875,
          y: 0,
          z: 51.71875
        },
        {
          x: -29.21875,
          y: 0,
          z: 51.71875
        },
        {
          x: -30,
          y: 0,
          z: 40
        },
        {
          x: -30,
          y: 0,
          z: 40
        },
        {
          x: -30,
          y: 0,
          z: 35
        },
        {
          x: -30,
          y: 0,
          z: 30
        },
        {
          x: -30,
          y: 0,
          z: 25
        },
        {
          x: -30,
          y: 0,
          z: 20
        },
        {
          x: -30,
          y: 0,
          z: 15
        },
        {
          x: -30,
          y: 0,
          z: 10
        },
        {
          x: -30,
          y: 0,
          z: 5
        },
        {
          x: -30,
          y: 0,
          z: 0
        },
        {
          x: -30,
          y: 0,
          z: 0
        },
        {
          x: -30,
          y: 0,
          z: -2.5
        },
        {
          x: -30,
          y: 0,
          z: -5
        },
        {
          x: -30,
          y: 0,
          z: -7.5
        },
        {
          x: -30,
          y: 0,
          z: -10
        },
        {
          x: -30,
          y: 0,
          z: -12.5
        },
        {
          x: -30,
          y: 0,
          z: -15
        },
        {
          x: -30,
          y: 0,
          z: -17.5
        }
      ]
    },
    {
      id: '5UgZpB*lI',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'qh1dAbAA6',
          signal: 'Green',
          hidden: false
        },
        endJointEnd: {
          end: 'A',
          joint: 'xtXaozeKP',
          signal: 'Green',
          hidden: true
        }
      },
      isFree: true,
      rayA: {
        x: -50,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      rayB: {
        x: -42.34375,
        y: 0,
        z: -82.5,
        dirXZ: -2.4227626539681686
      },
      coords: [
        {
          x: -50,
          y: 0,
          z: -140
        },
        {
          x: -50,
          y: 0,
          z: -135
        },
        {
          x: -50,
          y: 0,
          z: -130
        },
        {
          x: -50,
          y: 0,
          z: -125
        },
        {
          x: -50,
          y: 0,
          z: -120
        },
        {
          x: -50,
          y: 0,
          z: -115
        },
        {
          x: -50,
          y: 0,
          z: -110
        },
        {
          x: -50,
          y: 0,
          z: -105
        },
        {
          x: -50,
          y: 0,
          z: -100
        },
        {
          x: -50,
          y: 0,
          z: -100
        },
        {
          x: -49.84375,
          y: 0,
          z: -97.5
        },
        {
          x: -49.375,
          y: 0,
          z: -95
        },
        {
          x: -48.59375,
          y: 0,
          z: -92.5
        },
        {
          x: -47.5,
          y: 0,
          z: -90
        },
        {
          x: -46.09375,
          y: 0,
          z: -87.5
        },
        {
          x: -44.375,
          y: 0,
          z: -85
        },
        {
          x: -42.34375,
          y: 0,
          z: -82.5
        }
      ]
    },
    {
      id: 'hI2patcnQ',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: '548r6INPx',
          signal: 'Green',
          hidden: true
        },
        endJointEnd: {
          end: 'A',
          joint: '93pioTwTc',
          signal: 'Green',
          hidden: false
        }
      },
      isFree: true,
      rayA: {
        x: -30,
        y: 0,
        z: -82.5,
        dirXZ: 0
      },
      rayB: {
        x: -30,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      coords: [
        {
          x: -30,
          y: 0,
          z: -82.5
        },
        {
          x: -30,
          y: 0,
          z: -82.5
        },
        {
          x: -30,
          y: 0,
          z: -82.5
        },
        {
          x: -30,
          y: 0,
          z: -85
        },
        {
          x: -30,
          y: 0,
          z: -87.5
        },
        {
          x: -30,
          y: 0,
          z: -90
        },
        {
          x: -30,
          y: 0,
          z: -92.5
        },
        {
          x: -30,
          y: 0,
          z: -95
        },
        {
          x: -30,
          y: 0,
          z: -97.5
        },
        {
          x: -30,
          y: 0,
          z: -100
        },
        {
          x: -30,
          y: 0,
          z: -100
        },
        {
          x: -30,
          y: 0,
          z: -105
        },
        {
          x: -30,
          y: 0,
          z: -110
        },
        {
          x: -30,
          y: 0,
          z: -115
        },
        {
          x: -30,
          y: 0,
          z: -120
        },
        {
          x: -30,
          y: 0,
          z: -125
        },
        {
          x: -30,
          y: 0,
          z: -130
        },
        {
          x: -30,
          y: 0,
          z: -135
        },
        {
          x: -30,
          y: 0,
          z: -140
        }
      ]
    },
    {
      id: 'imLEEIsSI',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'A',
          joint: 'cHnEukiHT',
          signal: 'Green',
          hidden: false
        },
        endJointEnd: {
          end: 'A',
          joint: 'lAnEw8I69',
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
        x: -20,
        y: 0,
        z: -82.5,
        dirXZ: 3.141592653589793
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
          x: -20,
          y: 0,
          z: -97.5
        },
        {
          x: -20,
          y: 0,
          z: -95
        },
        {
          x: -20,
          y: 0,
          z: -92.5
        },
        {
          x: -20,
          y: 0,
          z: -90
        },
        {
          x: -20,
          y: 0,
          z: -87.5
        },
        {
          x: -20,
          y: 0,
          z: -85
        },
        {
          x: -20,
          y: 0,
          z: -82.5
        }
      ]
    },
    {
      id: '7NxaqYFNe',
      type: 'Block',
      segmentData: {
        startJointEnd: {
          end: 'B',
          joint: 'bkmbSr*HO',
          signal: 'Green',
          hidden: true
        },
        endJointEnd: {
          end: 'A',
          joint: 'uFI6heoBv',
          signal: 'Green',
          hidden: false
        }
      },
      isFree: true,
      rayA: {
        x: -7.65625,
        y: 0,
        z: -82.5,
        dirXZ: -0.7188299996216245
      },
      rayB: {
        x: 0,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      coords: [
        {
          x: -7.65625,
          y: 0,
          z: -82.5
        },
        {
          x: -7.65625,
          y: 0,
          z: -82.5
        },
        {
          x: -7.65625,
          y: 0,
          z: -82.5
        },
        {
          x: -5.625,
          y: 0,
          z: -85
        },
        {
          x: -3.90625,
          y: 0,
          z: -87.5
        },
        {
          x: -2.5,
          y: 0,
          z: -90
        },
        {
          x: -1.40625,
          y: 0,
          z: -92.5
        },
        {
          x: -0.625,
          y: 0,
          z: -95
        },
        {
          x: -0.15625,
          y: 0,
          z: -97.5
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
          z: -105
        },
        {
          x: 0,
          y: 0,
          z: -110
        },
        {
          x: 0,
          y: 0,
          z: -115
        },
        {
          x: 0,
          y: 0,
          z: -120
        },
        {
          x: 0,
          y: 0,
          z: -125
        },
        {
          x: 0,
          y: 0,
          z: -130
        },
        {
          x: 0,
          y: 0,
          z: -135
        },
        {
          x: 0,
          y: 0,
          z: -140
        }
      ]
    },
    {
      id: 'OC6kVf0aw',
      type: 'PathBlock',
      jointEnds: [
        {
          joint: 'JC3Jg412*',
          end: 'B'
        },
        {
          joint: 'VulIF9e9G',
          end: 'A'
        },
        {
          joint: 'lfIhXSjev',
          end: 'A'
        }
      ],
      queue: {
        rules: [
          {
            from: {
              joint: 'VulIF9e9G',
              end: 'A'
            },
            toOptions: [
              {
                joint: 'JC3Jg412*',
                end: 'B'
              }
            ]
          },
          {
            from: {
              joint: 'JC3Jg412*',
              end: 'B'
            },
            toOptions: [
              {
                joint: 'lfIhXSjev',
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
      id: 'rhG8GaXCy',
      type: 'PathBlock',
      jointEnds: [
        {
          joint: 'bkmbSr*HO',
          end: 'A'
        },
        {
          joint: 'lAnEw8I69',
          end: 'B'
        },
        {
          joint: '548r6INPx',
          end: 'A'
        },
        {
          joint: 'xtXaozeKP',
          end: 'B'
        },
        {
          joint: 't_RB49pXB',
          end: 'B'
        },
        {
          joint: 'Ocdv39BFY',
          end: 'B'
        }
      ],
      queue: {
        rules: [
          {
            from: {
              joint: 'bkmbSr*HO',
              end: 'A'
            },
            toOptions: [
              {
                joint: 'Ocdv39BFY',
                end: 'B'
              }
            ]
          },
          {
            from: {
              joint: 'lAnEw8I69',
              end: 'B'
            },
            toOptions: [
              {
                joint: 'Ocdv39BFY',
                end: 'B'
              }
            ]
          },
          {
            from: {
              joint: '548r6INPx',
              end: 'A'
            },
            toOptions: [
              {
                joint: 'Ocdv39BFY',
                end: 'B'
              }
            ]
          },
          {
            from: {
              joint: 'xtXaozeKP',
              end: 'B'
            },
            toOptions: [
              {
                joint: 'Ocdv39BFY',
                end: 'B'
              }
            ]
          },
          {
            from: {
              joint: 't_RB49pXB',
              end: 'B'
            },
            toOptions: [
              {
                joint: 'xtXaozeKP',
                end: 'B'
              },
              {
                joint: '548r6INPx',
                end: 'A'
              },
              {
                joint: 'lAnEw8I69',
                end: 'B'
              },
              {
                joint: 'bkmbSr*HO',
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
      id: 'GCk85dgJfi',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'We0DHYHztC',
        direction: 'BA',
        position: 55
      },
      pathBlock: 'OC6kVf0aw',
      pathBlockEnd: {
        end: 'B',
        joint: 'JC3Jg412*',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: 65,
        y: 0,
        z: 90,
        dirXZ: -1.5707963267948966
      }
    },
    {
      id: 'vu7hdVhH3g',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'hksLRfwbb3',
        direction: 'AB',
        position: 26.721613229624438
      },
      pathBlock: 'OC6kVf0aw',
      pathBlockEnd: {
        end: 'A',
        joint: 'VulIF9e9G',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: -13.203203041739584,
        y: 0,
        z: 66.18027861435012,
        dirXZ: 0.6115964703987232
      }
    },
    {
      id: 'dvTXndZAjc',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'PCCzXLyeh3',
        direction: 'AB',
        position: 40.90201653703053
      },
      pathBlock: 'OC6kVf0aw',
      pathBlockEnd: {
        end: 'A',
        joint: 'lfIhXSjev',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: -17.260324208184826,
        y: 0,
        z: 77.73739978079536,
        dirXZ: 0.7949393853110052
      }
    },
    {
      id: 'RKciObH5Yr',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'n8iosmnyms',
        direction: 'AB',
        position: 30.078328575426585
      },
      pathBlock: 'rhG8GaXCy',
      pathBlockEnd: {
        end: 'A',
        joint: 'bkmbSr*HO',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: 0,
        y: 0,
        z: -109.92167142457342,
        dirXZ: 0
      }
    },
    {
      id: '9l*ezwsQ6F',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'ilHSQ4_C8t',
        direction: 'AB',
        position: 27.5
      },
      pathBlock: 'rhG8GaXCy',
      pathBlockEnd: {
        end: 'B',
        joint: 'lAnEw8I69',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: -20,
        y: 0,
        z: -112.5,
        dirXZ: 0
      }
    },
    {
      id: 'fo5bm03C88',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'EqrxUS1J3q',
        direction: 'AB',
        position: 27.5
      },
      pathBlock: 'rhG8GaXCy',
      pathBlockEnd: {
        end: 'A',
        joint: '548r6INPx',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: -30,
        y: 0,
        z: -112.5,
        dirXZ: 0
      }
    },
    {
      id: 'hwX5vweKSz',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'l8TJWGeI*z',
        direction: 'AB',
        position: 30.07832857542659
      },
      pathBlock: 'rhG8GaXCy',
      pathBlockEnd: {
        end: 'B',
        joint: 'xtXaozeKP',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: -50,
        y: 0,
        z: -109.92167142457342,
        dirXZ: 0
      }
    },
    {
      id: 'Wk1Pvhwxmg',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'd5aLjjMCgQ',
        direction: 'BA',
        position: 27.5
      },
      pathBlock: 'rhG8GaXCy',
      pathBlockEnd: {
        end: 'B',
        joint: 't_RB49pXB',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: -30,
        y: 0,
        z: 12.5,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'nerSUPHH*N',
      type: 'Sensor',
      positionOnTrack: {
        trackId: 'joMKvKTieg',
        direction: 'BA',
        position: 27.5
      },
      pathBlock: 'rhG8GaXCy',
      pathBlockEnd: {
        end: 'B',
        joint: 'Ocdv39BFY',
        signal: 'Red',
        hidden: false
      },
      ray: {
        x: -20,
        y: 0,
        z: 12.5,
        dirXZ: 3.141592653589793
      }
    },
    {
      id: 'BbK8HD39Db',
      type: 'Signal',
      signal: 'Green',
      hidden: false,
      ray: {
        x: 120,
        y: 0,
        z: 90,
        dirXZ: -1.5707963267948966
      },
      positionOnTrack: {
        trackId: 'We0DHYHztC',
        direction: 'BA',
        position: 0
      },
      blockEnd: {
        end: 'B',
        joint: 'WNcwsykxz',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: '9Iykb0ufWF',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: 45,
        y: 0,
        z: 90,
        dirXZ: 1.5707963267948966
      },
      positionOnTrack: {
        trackId: 'We0DHYHztC',
        direction: 'AB',
        position: 5
      },
      blockEnd: {
        end: 'A',
        joint: 'JC3Jg412*',
        signal: 'Green',
        hidden: true
      }
    },
    {
      id: 'MA867UWrlv',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: 45,
        y: 0,
        z: 90,
        dirXZ: -1.5707963267948966
      },
      positionOnTrack: {
        trackId: 'We0DHYHztC',
        direction: 'BA',
        position: 75
      },
      blockEnd: {
        end: 'B',
        joint: 'JC3Jg412*',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'meJwC5Mndt',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: 10.625,
        y: 0,
        z: 79.375,
        dirXZ: 1.4288992721907328
      },
      positionOnTrack: {
        trackId: 'hksLRfwbb3',
        direction: 'AB',
        position: 56.72161322962444
      },
      blockEnd: {
        end: 'A',
        joint: 'VulIF9e9G',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'tXh0BJfsmL',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: 8.28125,
        y: 0,
        z: 89.21875,
        dirXZ: 1.4288992721907328
      },
      positionOnTrack: {
        trackId: 'PCCzXLyeh3',
        direction: 'AB',
        position: 70.90201653703053
      },
      blockEnd: {
        end: 'A',
        joint: 'lfIhXSjev',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'Orc__2FkSr',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: 10.625000000000002,
        y: 0,
        z: 79.375,
        dirXZ: -1.7126933813990606
      },
      positionOnTrack: {
        trackId: 'hksLRfwbb3',
        direction: 'BA',
        position: 8.103087604232059
      },
      blockEnd: {
        end: 'B',
        joint: 'VulIF9e9G',
        signal: 'Green',
        hidden: true
      }
    },
    {
      id: 'FvJihwec_G',
      type: 'Signal',
      signal: 'Green',
      hidden: false,
      ray: {
        x: -19.375,
        y: 0,
        z: 49.375,
        dirXZ: 0.1418970546041639
      },
      positionOnTrack: {
        trackId: 'hksLRfwbb3',
        direction: 'AB',
        position: 8.103087604232062
      },
      blockEnd: {
        end: 'A',
        joint: 'viei8_tDu',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: 'zFT7Q_84xv',
      type: 'Signal',
      signal: 'Green',
      hidden: false,
      ray: {
        x: -29.21875,
        y: 0,
        z: 51.71875,
        dirXZ: 0.1418970546041639
      },
      positionOnTrack: {
        trackId: 'PCCzXLyeh3',
        direction: 'AB',
        position: 10.128859505290077
      },
      blockEnd: {
        end: 'A',
        joint: 'Q0WyE_g9l',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: 'HVaJXuBW9i',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: 8.281249999999996,
        y: 0,
        z: 89.21875000000001,
        dirXZ: -1.7126933813990608
      },
      positionOnTrack: {
        trackId: 'PCCzXLyeh3',
        direction: 'BA',
        position: 10.12885950529008
      },
      blockEnd: {
        end: 'B',
        joint: 'lfIhXSjev',
        signal: 'Green',
        hidden: true
      }
    },
    {
      id: 'iHndtMWUEO',
      type: 'Signal',
      signal: 'Green',
      hidden: false,
      ray: {
        x: -19.375,
        y: 0,
        z: 49.375,
        dirXZ: -2.999695598985629
      },
      positionOnTrack: {
        trackId: 'hksLRfwbb3',
        direction: 'BA',
        position: 56.72161322962444
      },
      blockEnd: {
        end: 'B',
        joint: 'viei8_tDu',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: '6UV_6ZrAQy',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: -20,
        y: 0,
        z: -17.5,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'zEmMBFZL*6',
        direction: 'AB',
        position: 2.5
      },
      blockEnd: {
        end: 'A',
        joint: 'Ocdv39BFY',
        signal: 'Green',
        hidden: true
      }
    },
    {
      id: 'FsMl2PRT6C',
      type: 'Signal',
      signal: 'Green',
      hidden: false,
      ray: {
        x: -29.21875,
        y: 0,
        z: 51.71875,
        dirXZ: -2.999695598985629
      },
      positionOnTrack: {
        trackId: 'PCCzXLyeh3',
        direction: 'BA',
        position: 70.90201653703053
      },
      blockEnd: {
        end: 'B',
        joint: 'Q0WyE_g9l',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: '__ISouiUaT',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: -30,
        y: 0,
        z: -17.5,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'K6mAjp*F19',
        direction: 'AB',
        position: 2.5
      },
      blockEnd: {
        end: 'A',
        joint: 't_RB49pXB',
        signal: 'Green',
        hidden: true
      }
    },
    {
      id: 'jwesUbKTxC',
      type: 'Signal',
      signal: 'Green',
      hidden: false,
      ray: {
        x: -50,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'l8TJWGeI*z',
        direction: 'AB',
        position: 0
      },
      blockEnd: {
        end: 'A',
        joint: 'qh1dAbAA6',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: 'Z65hNFw8kP',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: -42.34375,
        y: 0,
        z: -82.5,
        dirXZ: -2.4227626539681686
      },
      positionOnTrack: {
        trackId: 'mUHB5nh*t',
        direction: 'AB',
        position: 2.86833265363237
      },
      blockEnd: {
        end: 'A',
        joint: 'xtXaozeKP',
        signal: 'Green',
        hidden: true
      }
    },
    {
      id: 'TUUzX*4ko5',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: -30,
        y: 0,
        z: -82.5,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: '3VorKxL8EZ',
        direction: 'BA',
        position: 2.5
      },
      blockEnd: {
        end: 'B',
        joint: '548r6INPx',
        signal: 'Green',
        hidden: true
      }
    },
    {
      id: 'av7Mbj2L_k',
      type: 'Signal',
      signal: 'Green',
      hidden: false,
      ray: {
        x: -30,
        y: 0,
        z: -140,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 'EqrxUS1J3q',
        direction: 'AB',
        position: 0
      },
      blockEnd: {
        end: 'A',
        joint: '93pioTwTc',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: 'ZZB_Un*GnX',
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
        trackId: 'ilHSQ4_C8t',
        direction: 'AB',
        position: 0
      },
      blockEnd: {
        end: 'A',
        joint: 'cHnEukiHT',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: 'YBR4Dh369i',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: -20,
        y: 0,
        z: -82.5,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: 's2SCEk8K_',
        direction: 'AB',
        position: 2.5
      },
      blockEnd: {
        end: 'A',
        joint: 'lAnEw8I69',
        signal: 'Green',
        hidden: true
      }
    },
    {
      id: 'e6EZ7prgy2',
      type: 'Signal',
      signal: 'Green',
      hidden: true,
      ray: {
        x: -7.6562499999999964,
        y: 0,
        z: -82.5,
        dirXZ: 2.422762653968169
      },
      positionOnTrack: {
        trackId: 'e232Wsy0Ho',
        direction: 'BA',
        position: 2.8683326536323754
      },
      blockEnd: {
        end: 'B',
        joint: 'bkmbSr*HO',
        signal: 'Green',
        hidden: true
      }
    },
    {
      id: 'HH8b7EGhux',
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
        trackId: 'n8iosmnyms',
        direction: 'AB',
        position: 0
      },
      blockEnd: {
        end: 'A',
        joint: 'uFI6heoBv',
        signal: 'Green',
        hidden: false
      }
    },
    {
      id: 'FPRybWVOI9',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: -7.65625,
        y: 0,
        z: -82.5,
        dirXZ: -0.7188299996216245
      },
      positionOnTrack: {
        trackId: 'e232Wsy0Ho',
        direction: 'AB',
        position: 20.078328575426585
      },
      blockEnd: {
        end: 'A',
        joint: 'bkmbSr*HO',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'CEg9Fw5Fmn',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: -20,
        y: 0,
        z: -82.5,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: 's2SCEk8K_',
        direction: 'BA',
        position: 17.5
      },
      blockEnd: {
        end: 'B',
        joint: 'lAnEw8I69',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: '*GQOclgqgC',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: -30,
        y: 0,
        z: -82.5,
        dirXZ: 0
      },
      positionOnTrack: {
        trackId: '3VorKxL8EZ',
        direction: 'AB',
        position: 17.5
      },
      blockEnd: {
        end: 'A',
        joint: '548r6INPx',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'govlxnbM9j',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: -42.34375,
        y: 0,
        z: -82.5,
        dirXZ: 0.7188299996216244
      },
      positionOnTrack: {
        trackId: 'mUHB5nh*t',
        direction: 'BA',
        position: 20.078328575426582
      },
      blockEnd: {
        end: 'B',
        joint: 'xtXaozeKP',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'mDRZprFQKZ',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: -30,
        y: 0,
        z: -17.5,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: 'K6mAjp*F19',
        direction: 'BA',
        position: 17.5
      },
      blockEnd: {
        end: 'B',
        joint: 't_RB49pXB',
        signal: 'Red',
        hidden: false
      }
    },
    {
      id: 'yndnb*U9ur',
      type: 'Signal',
      signal: 'Red',
      hidden: false,
      ray: {
        x: -20,
        y: 0,
        z: -17.5,
        dirXZ: 3.141592653589793
      },
      positionOnTrack: {
        trackId: 'zEmMBFZL*6',
        direction: 'BA',
        position: 17.5
      },
      blockEnd: {
        end: 'B',
        joint: 'Ocdv39BFY',
        signal: 'Red',
        hidden: false
      }
    }
  ],
  camera: {
    alpha: 6.137499999999998,
    beta: 0.8166666666666673,
    radius: 209.01888000000056,
    target: {
      x: 20.554347547083406,
      y: 0,
      z: -44.532878382963574
    },
    position: {
      x: 171.28759216068013,
      y: 143.1057304521914,
      z: -66.64918631301794
    }
  },
  _version: 2,
  _format: 'fahrplan'
};
