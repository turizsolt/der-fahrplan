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

export const rightMapColumnStyle = style({
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    width: 'calc(100% - 270px - 2px)',
    height: 'calc(100% - 20px)',
    left: '250px',
    top: '0px'
});

export const rightColumnDiagramStyle = style({
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    width: 'calc(100% - 270px - 93px)',
    height: 'calc(100% - 20px)',
    left: '250px',
    top: '0px'
});

export const rightRightColumnDiagramStyle = style({
    border: '1px solid purple',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    width: '80px',
    height: 'calc(100% - 20px)',
    right: '20px',
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

export const pixiDiagramContainerStyle = style({
    width: '100%',
    height: 'calc(100% - 60px)',
    position: 'relative',
    border: '1px solid red',
});

export const pixiDiagramTimeStyle = style({
    width: '100%',
    marginTop: '10px',
    height: '40px',
    position: 'relative',
    border: '1px solid blue',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column'
});

export const routeStyle = style({
    border: '1px solid black',
    borderRadius: '3px',
    display: 'flex',
    backgroundColor: '#cec',
    height: '40px',
    margin: '5px 5px 0 5px',
    cursor: 'pointer'
});

export const createRouteStyle = style({
    margin: 'auto 5px auto 5px',
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

export const settingsButtonStyle = style({
    height: '21px',
    whiteSpace: 'nowrap',
    width: 'auto',
    marginLeft: '10px',
    padding: '0 5px 0 5px'
});

export const arrivalButtonStyle = style({
    backgroundColor: '#c4e7eb'
});

export const departureButtonStyle = style({
    backgroundColor: '#ebe7c4'
});

export const timeDotStyle = style({
    border: '1px solid #1a7700',
    borderRadius: '6px',
    height: '12px',
    width: '12px',
    fontSize: '10px',
    textAlign: 'center',
    backgroundColor: '#cceecc',
    color: '#1a7700',
    '&:hover': {
        cursor: 'pointer'
    }
} as any);

export const invertStyle = style({
    backgroundColor: '#1a7700',
    color: '#cceecc'
});

export const addTripsStyle = style({
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
});

export const addTripsTextareaStyle = style({
    height: '50%',
    width: '74px',
    resize: 'none'
});

export const connectorStyle = style({
    border: '1px solid red',
    position: 'absolute',
    width: 'calc(100% - 20px)',
    height: 'calc(100% - 20px)',
    left: '0px',
    top: '0px'
});

export const connectorTopStyle = style({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '25px',
    border: '1px solid red',
    textAlign: 'center'
});

export const connectorLeftStyle = style({
    position: 'absolute',
    top: '25px',
    left: 0,
    width: '200px',
    bottom: 0,
    border: '1px solid red'
});

export const connectorRightStyle = style({
    position: 'absolute',
    top: '25px',
    right: 0,
    width: '200px',
    bottom: 0,
    border: '1px solid red',
    textAlign: 'right'
});

export const connectorMiddleStyle = style({
    position: 'absolute',
    top: '25px',
    left: '200px',
    right: '200px',
    bottom: 0,
    border: '1px solid red',
    overflowY: 'scroll'
});

export const getContrastColor = (hexcolor: string): string => {
    var r = parseInt(hexcolor.substr(1, 2), 16);
    var g = parseInt(hexcolor.substr(3, 2), 16);
    var b = parseInt(hexcolor.substr(5, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#ffffff';
}