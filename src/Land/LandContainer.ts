import { startEngine, tick, stopEngine } from 'src/actions';
import { connect } from 'react-redux';
import { Land } from './Land';
import { LandModel } from './LandModel';

// selector

const getModel = ((state: any) => state.LandReducer);

// mapToStateProps
export interface ILandMapToStateProps {
  model: LandModel,
}

const mapStateToProps = (state: any):ILandMapToStateProps => ({
    model: getModel(state)
});

// dispatchToProps
  
export interface ILandDispatchToProps {
  onEngineClicked: (id: string) => void,
  onEngineDoubleClicked: (id: string) => void,
  onTick: () => void
};

const mapDispatchToProps = {
    onEngineClicked: startEngine,
    onEngineDoubleClicked: stopEngine,
    onTick: tick
};

export type ILandProps = ILandMapToStateProps & ILandDispatchToProps;

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(Land);
