import { startEngine, tick, stopEngine, reverseEngine } from 'src/actions';
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
  onEngineReverse: (id: string) => void,
  onEngineStart: (id: string) => void,
  onEngineStop: (id: string) => void,
  onTick: () => void
};

const mapDispatchToProps = {
    onEngineReverse: reverseEngine,
    onEngineStart: startEngine,
    onEngineStop: stopEngine,
    onTick: tick
};

export type ILandProps = ILandMapToStateProps & ILandDispatchToProps;

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(Land);
