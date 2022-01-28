import { style } from 'typestyle';

export const overlayStyle = style({
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: '100%'
});

export const routeListStyle = style({
    border: '1px solid blue',
    position: 'absolute',
    width: '240px',
    height: 'calc(100% - 20px)',
    left: '0px',
    top: '0px'
});

export const rightColumnStyle = style({
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    width: 'calc(100% - 270px)',
    height: 'calc(100% - 20px)',
    left: '250px',
    top: '0px'
});

export const pixiMapSettingsStyle = style({
    width: 'calc(100% - 20px)',
    height: '25px',
    border: '1px solid green',
    marginBottom: '10px',
    padding: '10px 10px 10px 10px'
});

export const pixiMapContainerStyle = style({
    width: '100%',
    height: 'calc(100% - 10px)',
    position: 'relative',
    border: '1px solid red',
});

export const connectorStyle = style({
    border: '1px solid red',
    position: 'absolute',
    width: 'calc(100% - 20px)',
    height: 'calc(100% - 20px)',
    left: '0px',
    top: '0px'
});

export const routeStyle = style({
    border: '1px solid black',
    borderRadius: '3px',
    display: 'flex',
    backgroundColor: '#aca',
    height: '40px',
    margin: '5px 5px 0 5px',
    cursor: 'pointer'
});

export const routeNameStyle = style({
    border: '1px solid black',
    borderRadius: '3px',
    width: '40px',
    textAlign: 'center',
    height: '1em',
    margin: 'auto 5px auto 5px',
    overflow: 'hidden'
});

export const routeTerminiStyle = style({
    margin: 'auto 5px auto 5px'
});

export const getContrastColor = (hexcolor: string): string => {
    var r = parseInt(hexcolor.substr(1, 2), 16);
    var g = parseInt(hexcolor.substr(3, 2), 16);
    var b = parseInt(hexcolor.substr(5, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}