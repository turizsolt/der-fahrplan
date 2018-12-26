import * as React from 'react';

export class Engine extends React.Component<any, {}> {
    protected image:string;

    public constructor(props:any, state:{}) {
        super(props, state);

        this.image = "tiles/engine-diesel.svg";

        this.onStart = this.onStart.bind(this);
        this.onReverse = this.onReverse.bind(this);
        this.onStop = this.onStop.bind(this);
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
                <span />
                {false && <span style={{cursor: "pointer"}} id={this.props.id}>⚪</span> }
                <span>
                    { this.props.moving===0 && <>
                        <span style={{cursor: "pointer"}} id={this.props.id} onClick={this.onReverse}>⏪</span>
                        <span style={{cursor: "pointer"}} id={this.props.id} onClick={this.onStart}>⏩</span>
                    </> }
                    { this.props.moving!==0 && !this.props.willStop && 
                        <span style={{cursor: "pointer"}} id={this.props.id} onClick={this.onStop}>⏸</span>
                    }
                    { this.props.moving!==0 && this.props.willStop && <span>⏺</span> }
                </span>
                {false && <span style={{cursor: "pointer"}} id={this.props.id}>⚫</span> }
                <span />
            </div>
        </>);         
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
