import * as React from 'react';
import { Car, ICarProps } from '../Car';

export class PassengerCar extends Car<ICarProps> {
    public constructor(props:ICarProps) {
        super(props);

        this.image = "tiles/passenger-car.svg";
    }

    public render() {
        return (<>
            <img 
                src={this.image}
                style={{
                    position: "absolute", 
                    ...this.props.model.box.getPositionStyle()
                }} 
                id={this.props.model.id}  
            />
            <div
                style={{
                    display:"flex",
                    fontSize:"60%",
                    justifyContent: "space-between",
                    lineHeight:this.props.model.box.getHeight()+"px",
                    position: "absolute",
                    ...this.props.model.box.getPositionStyle(),
                }}>
                {this.renderEndA()}
                {this.renderEndB()}
            </div>
        </>);         
    }
}
