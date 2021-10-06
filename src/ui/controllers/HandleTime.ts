
export function handleTimeText(event: { currentTarget: {value: string}}): {time: number, timeStr: string} {
    let value = event.currentTarget.value;
    value = value
      .split("")
      .filter((x) => ("0" <= x && x <= "9") || x === '.')
      .join("");

    if(!value) {
        return {time: undefined, timeStr: ''};
    }

    const chunks = value.split('.');
    value = chunks[0];

    if (value.length > 4) {
      value = value.substr(0, 4);
    }

    let secValue = undefined;
    let seconds = 0;
    
    if(chunks.length > 1) {
      secValue = chunks[1].split("")
        .filter((x) => "0" <= x && x <= "9")
        .join("");

      if (secValue.length > 2) {
        secValue = secValue.substr(0, 2);
      }

      if(secValue.length === 1) {
        seconds = parseInt(secValue, 10) * 10 || 0;
      } else {
        seconds = parseInt(secValue, 10) || 0;
      }
    }

    let time = parseInt(value, 10) || 0;
    if (value.length > 2) {
      value = value.substr(0, value.length - 2) + ":" + value.substr(-2);
      time =
        ((parseInt(value.substr(0, value.length - 2), 10) * 60) || 0) +
        (parseInt(value.substr(-2), 10) || 0);
    }

    if(secValue !== undefined) value += '.' + secValue;

    return {time: time * 60 + seconds, timeStr: value};
}
