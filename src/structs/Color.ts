export class Color {
  constructor(public red: number, public green: number, public blue: number) { }

  private static nextIndex = Math.random() * 16 | 0;

  private static colors = [
    { r: 9.955226005933953, g: 249.60463607930217, b: 238.8704769054388 },
    { r: 247.78518580431174, g: 196.4996827518554, b: 17.71495868262942 },
    { r: 92.12010013919299, g: 11.372335437934852, b: 96.49588949544955 },
    { r: 65.95278217179914, g: 88.74612815230121, b: 60.36563271867627 },
    { r: 233.44066269748808, g: 11.420506661114125, b: 88.6799977362127 },
    { r: 211.6895840193146, g: 53.445486821735045, b: 242.50201681204777 },
    { r: 31.57221486956608, g: 0.6311081250125872, b: 3.024945019463423 },
    { r: 197.30701103657648, g: 178.91450026996145, b: 172.14258390625267 },
    { r: 112.00906681109454, g: 119.57047204218505, b: 154.966220538276 },
    { r: 79.58490853930583, g: 194.79423005295592, b: 145.15996631414205 },
    { r: 215.67282918176673, g: 46.24748765113292, b: 15.350719514653285 },
    { r: 246.3787647261083, g: 164.85210225300085, b: 43.05161305076777 },
    { r: 145.12268189785829, g: 92.76290076061073, b: 232.70389519990945 },
    { r: 95.18647547255212, g: 85.49494866936365, b: 2.185339734878735 },
    { r: 72.8220167124732, g: 114.53807974122807, b: 177.14161666065834 },
    { r: 241.5502862441533, g: 226.8066720926281, b: 204.84179011359086 }
  ];

  static CreateRandom(): Color {
    const color = new Color(this.colors[this.nextIndex].r / 255, this.colors[this.nextIndex].g / 255, this.colors[this.nextIndex].b / 255);
    this.nextIndex = (this.nextIndex + 1) % 16;
    return color;
    // return new Color(Math.random(), Math.random(), Math.random());
  }

  static White(): Color {
    return new Color(1, 1, 1);
  }

  getRgbString(): string {
    return `rgb(${this.red * 255},${this.green * 255},${this.blue * 255})`;
  }

  private toHex(n: number): string {
    return (n < 16 ? '0' : '') + Math.floor(n).toString(16);
  }

  getHexaString(): string {
    return `#${this.toHex(this.red * 255)}${this.toHex(this.green * 255)}${this.toHex(this.blue * 255)}`;
  }
}
