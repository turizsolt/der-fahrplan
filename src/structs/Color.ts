export class Color {
  constructor(public red: number, public green: number, public blue: number) {}

  static CreateRandom(): Color {
    return new Color(Math.random(), Math.random(), Math.random());
  }

  static White(): Color {
    return new Color(1, 1, 1);
  }
}
