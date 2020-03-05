export const TYPES = {
  Land: Symbol.for('Land'),

  Store: Symbol.for('Store'),
  FactoryOfStore: Symbol.for('Factory<Store>'),

  Engine: Symbol.for('Engine'),
  EngineRenderer: Symbol.for('EngineRenderer'),
  FactoryOfEngine: Symbol.for('Factory<Engine>'),

  Track: Symbol.for('Track'),
  TrackRenderer: Symbol.for('TrackRenderer'),
  FactoryOfTrack: Symbol.for('Factory<Track>'),

  TrackSwitch: Symbol.for('TrackSwitch'),
  TrackSwitchRenderer: Symbol.for('TrackSwitchRenderer'),
  FactoryOfTrackSwitch: Symbol.for('Factory<TrackSwitch>'),

  PassengerRenderer: Symbol.for('PassengerRenderer'),

  Platform: Symbol.for('Platform'),
  PlatformRenderer: Symbol.for('PlatformRenderer'),
  FactoryOfPlatform: Symbol.for('Factory<Platform>'),

  TrackJoint: Symbol.for('TrackJoint'),
  TrackJointRenderer: Symbol.for('TrackJointRenderer'),
  FactoryOfTrackJoint: Symbol.for('Factory<TrackJoint>'),

  TrackJointConnector: Symbol.for('TrackJointConnector'),
  FactoryOfTrackJointConnector: Symbol.for('Factory<TrackJointConnector>'),

  MeshProvider: Symbol.for('MeshProvider'),
  FactoryOfMeshProvider: Symbol.for('Factory<MeshProvider>')
};
