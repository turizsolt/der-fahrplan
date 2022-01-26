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
    width: '100%',
    height: '40px',
    border: '1px solid green',
    marginBottom: '10px'
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
