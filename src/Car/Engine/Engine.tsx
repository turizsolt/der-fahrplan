import * as React from 'react';
import { Car, ICarProps } from '../Car';
import { EngineModel } from './EngineModel';

export class Engine extends Car<IEngineProps> {
    protected image:string;

    public constructor(props:ICarProps & IEngineProps) {
        super(props);

        this.image = "tiles/engine-diesel.svg";

        this.onStart = this.onStart.bind(this);
        this.onReverse = this.onReverse.bind(this);
        this.onStop = this.onStop.bind(this);
    }
    
    public render() {
        return (<>
            <img 
                src={this.image}
                style={{position: "absolute", ...this.props.model.box.getPositionStyle()}} 
                
                
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
                {this.renderEngineButtons()}
                {this.renderEndB()}
            </div>
        </>);         
    }

    protected renderEngineButtons() {
        return (
            <span>
                { this.props.model.moving===0 && <>
                    <span style={{cursor: "pointer"}} id={this.props.model.id} onClick={this.onReverse}>⏪</span>
                    <span style={{cursor: "pointer"}} id={this.props.model.id} onClick={this.onStart}>⏩</span>
                </> }
                { this.props.model.moving!==0 && !this.props.model.willStopOnTile && 
                    <span style={{cursor: "pointer"}} id={this.props.model.id} onClick={this.onStop}>⏸</span>
                }
                { this.props.model.moving!==0 && this.props.model.willStopOnTile && <span>⏺</span> }
            </span>
        );
    }

    protected onStart(event: React.MouseEvent<HTMLElement>) {
        if(this.props.onStart) { this.props.onStart(event); }
    }

    protected onReverse(event: React.MouseEvent<HTMLElement>) {
        if(this.props.onReverse) { this.props.onReverse(event); }
    }

    protected onStop(event: React.MouseEvent<HTMLElement>) {
        if(this.props.onStop) { this.props.onStop(event); }
    }

}

export interface IEngineProps extends ICarProps {
    model: EngineModel,
    onStart: (event: React.MouseEvent<HTMLElement>) => void,
    onReverse: (event: React.MouseEvent<HTMLElement>) => void,
    onStop: (event: React.MouseEvent<HTMLElement>) => void,
}
