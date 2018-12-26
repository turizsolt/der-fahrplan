import * as React from 'react';
import { Car } from '../Car';

export class PassengerCar extends Car {
    public constructor(props:any, state:{}) {
        super(props, state);

        this.image = "tiles/passenger-car.svg";
    }

    public render() {
        return (<>
            <img 
                src={this.image}
                style={{position: "absolute", left: this.props.left+"px", top: this.props.top+"px", width: "60px", height: "30px"}} 
                
                
                id={this.props.id}  
            />
            <div
                style={{display:"flex", justifyContent: "space-between", position: "absolute", left: this.props.left+"px", top: this.props.top+"px", width: "60px", height: "30px", lineHeight:"30px", fontSize:"60%"}}>
                {this.renderEndA()}
                {this.renderEndB()}
            </div>
        </>);         
    }
}
