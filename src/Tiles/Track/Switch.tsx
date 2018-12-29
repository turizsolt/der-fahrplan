import * as React from 'react';
import { SwitchModel } from './SwitchModel';

export class Switch extends React.Component<ISwitchProps, {}> {
    protected image:string;
    protected imageSwitched:string;

    public constructor(props:ISwitchProps) {
        super(props);

        this.image = "tiles/track-switch-line.svg";
        this.imageSwitched = "tiles/track-switch-s.svg";

        this.onSwitch = this.onSwitch.bind(this);
    }

    public render() {
        return <div style={{
            ...this.props.model.box.getPositionStyle(),
            backgroundImage: "url("+(this.props.model.isSwitched()?this.imageSwitched:this.image)+")",
            backgroundRepeat: "repeat",
            borderLeft: "1px dotted red",
            borderRight: "1px dotted blue",
            position: "absolute",
        }} 
            id={this.props.model.id}
            onClick={this.onSwitch}
        />
    }

    protected onSwitch(event: React.MouseEvent<HTMLElement>) {
        if(this.props.onSwitch) { this.props.onSwitch(event);}
    }
}

export interface ISwitchProps {
    model: SwitchModel;
    onSwitch: (event: React.MouseEvent<HTMLElement>) => void,
}
