export class QuadraticEquation {
  static solve(a: number, b: number, c: number): number[] {
    const d = b * b - 4 * a * c;
    if (d < 0) return [];
    if (d == 0) return [-b / (2 * a)];
    return [(-b + Math.sqrt(d)) / (2 * a), (-b - Math.sqrt(d)) / (2 * a)];
  }
}
