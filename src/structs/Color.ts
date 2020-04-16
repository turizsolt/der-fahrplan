export class Color {
  constructor(public red: number, public green: number, public blue: number) {}

  static CreateRandom(): Color {
    return new Color(Math.random(), Math.random(), Math.random());
  }

  static White(): Color {
    return new Color(1, 1, 1);
  }

  getRgbString(): string {
    return `rgb(${this.red * 255},${this.green * 255},${this.blue * 255})`;
  }
}
