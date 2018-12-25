import * as React from 'react';

export class PassengerCar extends React.Component<any, {}> {
    private image:string;

    public constructor(props:any, state:{}) {
        super(props, state);

        this.image = "tiles/passenger-car.svg";

        this.onAttachCarA = this.onAttachCarA.bind(this);
        this.onAttachCarB = this.onAttachCarB.bind(this);
        this.onDetachCarA = this.onDetachCarA.bind(this);
        this.onDetachCarB = this.onDetachCarB.bind(this);
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
                
                {this.props.model.attachedA && <span style={{cursor: "pointer"}} id={this.props.id} onClick={this.onDetachCarA}>⚫</span> }
                {!this.props.model.attachedA && <span style={{cursor: "pointer"}} id={this.props.id} onClick={this.onAttachCarA}>⚪</span> }
                
                {this.props.model.attachedB && <span style={{cursor: "pointer"}} id={this.props.id} onClick={this.onDetachCarB}>⚫</span> }
                {!this.props.model.attachedB && <span style={{cursor: "pointer"}} id={this.props.id} onClick={this.onAttachCarB}>⚪</span> }
            </div>
        </>);         
    }

    private onAttachCarA(event: React.MouseEvent<HTMLElement>) {
        if(this.props.onAttach) { this.props.onAttach(event, "A");}
    }

    private onAttachCarB(event: React.MouseEvent<HTMLElement>) {
        if(this.props.onAttach) { this.props.onAttach(event, "B");}
    }

    private onDetachCarA(event: React.MouseEvent<HTMLElement>) {
        if(this.props.onDetach) { this.props.onDetach(event, "A");}
    }

    private onDetachCarB(event: React.MouseEvent<HTMLElement>) {
        if(this.props.onDetach) { this.props.onDetach(event, "B");}
    }
}
