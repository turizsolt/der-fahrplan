export function almost(a, b) {
  return Math.abs(a - b) < 0.00001;
}

export function almostOrLess(a, b) {
  return a < b - 0.00001;
}

export function almostBetween(a, v, b) {
  return (a - 0.00001) < v && v < (b + 0.00001);
}

export function almostDirection(a, b) {
  const diff = Math.abs(a - b);
  const small = 0.00001;
  return (
    diff < small || (2 * Math.PI - small < diff && diff < 2 * Math.PI + small)
  );
}
