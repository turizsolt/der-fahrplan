export interface PassengerGenerator {
  init(): PassengerGenerator;
  tick(): void;
}
