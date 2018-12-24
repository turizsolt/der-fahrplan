import * as React from 'react';

export class Track extends React.Component<ITrackProps, any> {

    public render() {
        return <img src="tiles/track-line.svg" style={{position: "absolute", left: this.props.left+"px", top: this.props.top+"px", width: "60px", height: "30px"}} />
    }
}

export interface ITrackProps {
    left: number;
    top: number;
}