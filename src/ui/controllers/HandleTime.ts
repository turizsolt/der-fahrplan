
export function handleTimeText(event: { currentTarget: {value: string}}): {time: number, timeStr: string} {
    let value = event.currentTarget.value;
    value = value
      .split("")
      .filter((x) => "0" <= x && x <= "9")
      .join("");
    if (value.length > 4) {
      value = value.substr(0, 4);
    }
    let time = parseInt(value, 10);
    if (value.length > 2) {
      value = value.substr(0, value.length - 2) + ":" + value.substr(-2);
      time =
        parseInt(value.substr(0, value.length - 2), 10) * 60 +
        parseInt(value.substr(-2), 10);
    }

    return {time: value === "" ? undefined : time * 60, timeStr: value};
}