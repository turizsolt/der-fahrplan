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
    return hour + ':' + (min < 10 ? '0' : '') + min;
  }
}
