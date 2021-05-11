let text: string = '';

export const copyTripId = (tripId: string): void => {
  text = tripId;
};

export const pasteTripId = (): string => {
  return text;
};
