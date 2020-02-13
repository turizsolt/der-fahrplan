export const TYPES = {
  Land: Symbol.for('Land'),

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
  TrackJointRenderer: Symbol.for('TrackJointRenderer')
};
