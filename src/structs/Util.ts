export class Util {
    public static timeToStr(time: number, hideHour: boolean = false): string {
        if (time === undefined) return '';
        if (isNaN(time)) return '-';

        const sec = time % 60;
        const minutes = (time - sec) / 60;
        const min = minutes % 60;
        const hour = (minutes - min) / 60;
        return (hour || !hideHour)
            ? hour.toString() + (min < 10 ? ':0' : ':') + min.toString()
            : min.toString();
    }
}
