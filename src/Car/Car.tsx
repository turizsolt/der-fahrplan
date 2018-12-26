import * as React from 'react';

export abstract class Car extends React.Component<any, {}> {
    protected image:string;

    public constructor(props:any, state:{}) {
        super(props, state);

        this.onAttachCarA = this.onAttachCarA.bind(this);
        this.onAttachCarB = this.onAttachCarB.bind(this);
        this.onDetachCarA = this.onDetachCarA.bind(this);
        this.onDetachCarB = this.onDetachCarB.bind(this);
    }

    protected renderEndA() {
        return (<>
            {this.props.model.attachedA && <span style={{cursor: "pointer"}} id={this.props.id} onClick={this.onDetachCarA}>⚫</span> }
            {!this.props.model.attachedA && <span style={{cursor: "pointer"}} id={this.props.id} onClick={this.onAttachCarA}>⚪</span> }
        </>);
    }

    protected renderEndB() {
        return (<>
            {this.props.model.attachedB && <span style={{cursor: "pointer"}} id={this.props.id} onClick={this.onDetachCarB}>⚫</span> }
            {!this.props.model.attachedB && <span style={{cursor: "pointer"}} id={this.props.id} onClick={this.onAttachCarB}>⚪</span> }
        </>);
    }

    protected onAttachCarA(event: React.MouseEvent<HTMLElement>) {
        if(this.props.onAttach) { this.props.onAttach(event, "A");}
    }

    protected onAttachCarB(event: React.MouseEvent<HTMLElement>) {
        if(this.props.onAttach) { this.props.onAttach(event, "B");}
    }

    protected onDetachCarA(event: React.MouseEvent<HTMLElement>) {
        if(this.props.onDetach) { this.props.onDetach(event, "A");}
    }

    protected onDetachCarB(event: React.MouseEvent<HTMLElement>) {
        if(this.props.onDetach) { this.props.onDetach(event, "B");}
    }
}
