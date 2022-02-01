export class Util {
  public static timeToStr(time: number, hideHour: boolean = false): string {
    if (time === undefined) return '';
    if (isNaN(time)) return '-';

    const sec = time % 60;
    const minutes = (time - sec) / 60;
    const min = minutes % 60;
    const hour = (minutes - min) / 60;
    return hour || !hideHour
      ? hour.toString() + (min < 10 ? ':0' : ':') + min.toString()
      : min.toString();
  }

  public static first<T>(arr: T[]): T {
    return arr?.[0];
  }

  public static last<T>(arr: T[]): T {
    return arr?.[arr.length - 1];
  }

  public static timeToString(time: number): string {
    const hour = Math.floor(time / 3600);
    const min = Math.floor((time - hour * 3600) / 60);
    const sec = Math.floor((time - hour * 3600) % 60)
    return hour + ':' + (min < 10 ? '0' : '') + min + (sec === 0 ? '' : (sec % 10 === 0 ? ('.' + sec / 10) : ('.' + (sec < 10 ? '0' : '') + sec)));
  }

  public static timeToStringNoHour(time: number): string {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60)
    return min + (sec === 0 ? '' : (sec % 10 === 0 ? ('.' + sec / 10) : ('.' + (sec < 10 ? '0' : '') + sec)));
  }

  public static stringToTime(str: string): number {
    const dotPos = str.indexOf('.');
    let result = 0;
    if (dotPos !== -1) {
      const lastBit = str.slice(dotPos + 1);
      result = parseInt(lastBit, 10);
      if (lastBit.length === 1) {
        result *= 10;
      }

      str = str.slice(0, dotPos);
    }
    const colonPos = str.indexOf(':');

    if (colonPos !== -1) {
      return result + parseInt(str.slice(0, colonPos), 10) * 3600 + parseInt(str.slice(colonPos + 1), 10) * 60;
    }
    return result + parseInt(str, 10) * 60;
  }

  public static generateRouteName(): string {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26)) + (Math.floor(Math.random() * 90 + 10)).toString();
  }
}
