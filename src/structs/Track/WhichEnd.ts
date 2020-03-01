export enum WhichEnd {
  A = 'A',
  B = 'B'
}

export const otherEnd = (x: WhichEnd) => {
  return x === WhichEnd.A ? WhichEnd.B : WhichEnd.A;
};
