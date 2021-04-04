export const TYPES = {
  Land: Symbol.for('Land'),

  Store: Symbol.for('Store'),
  FactoryOfStore: Symbol.for('Factory<Store>'),

  Wagon: Symbol.for('Wagon'),
  WagonRenderer: Symbol.for('WagonRenderer'),
  FactoryOfWagon: Symbol.for('Factory<Wagon>'),

  Train: Symbol.for('Train'),
  FactoryOfTrain: Symbol.for('Factory<Train>'),

  Track: Symbol.for('Track'),
  TrackRenderer: Symbol.for('TrackRenderer'),
  FactoryOfTrack: Symbol.for('Factory<Track>'),

  TrackSwitch: Symbol.for('TrackSwitch'),
  TrackSwitchRenderer: Symbol.for('TrackSwitchRenderer'),
  FactoryOfTrackSwitch: Symbol.for('Factory<TrackSwitch>'),

  TrackJoint: Symbol.for('TrackJoint'),
  TrackJointRenderer: Symbol.for('TrackJointRenderer'),
  FactoryOfTrackJoint: Symbol.for('Factory<TrackJoint>'),
  FactoryOfTrackJointRenderer: Symbol.for('Factory<TrackJointRenderer>'),

  Passenger: Symbol.for('Passenger'),
  PassengerRenderer: Symbol.for('PassengerRenderer'),
  FactoryOfPassenger: Symbol.for('Factory<Passenger>'),

  PassengerGenerator: Symbol.for('PassengerGenerator'),
  FactoryOfPassengerGenerator: Symbol.for('Factory<PassengerGenerator>'),

  Platform: Symbol.for('Platform'),
  PlatformRenderer: Symbol.for('PlatformRenderer'),
  FactoryOfPlatform: Symbol.for('Factory<Platform>'),

  MeshProvider: Symbol.for('MeshProvider'),
  FactoryOfMeshProvider: Symbol.for('Factory<MeshProvider>'),

  Route: Symbol.for('Route'),
  FactoryOfRoute: Symbol.for('Factory<Route>'),

  RouteStop: Symbol.for('RouteStop'),
  FactoryOfRouteStop: Symbol.for('Factory<RouteStop>'),

  Trip: Symbol.for('Trip'),
  FactoryOfTrip: Symbol.for('Factory<Trip>'),

  TripStop: Symbol.for('TripStop'),
  FactoryOfTripStop: Symbol.for('Factory<TripStop>'),

  Station: Symbol.for('Station'),
  StationRenderer: Symbol.for('StationRenderer'),
  FactoryOfStation: Symbol.for('Factory<Station>')
};
