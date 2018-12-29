import { startEngine, tick, stopEngine, reverseEngine, End, attachCar, detachCar, trackSwitch } from 'src/actions';
import { connect } from 'react-redux';
import { Land } from './Land';
import { TileModel } from 'src/Tiles/TileModel';

// selector

const getModel = ((state: any) => state.LandReducer);

// mapToStateProps
export interface ILandMapToStateProps {
  model: Map<string, TileModel[]>,
}

const mapStateToProps = (state: any):ILandMapToStateProps => ({
    model: getModel(state)
});

// dispatchToProps
  
export interface ILandDispatchToProps {
  onAttachCar: (id: string, end:End) => void,
  onDetachCar: (id: string, end:End) => void,
  onEngineReverse: (id: string) => void,
  onEngineStart: (id: string) => void,
  onEngineStop: (id: string) => void,
  onSwitch: (id: string) => void,
  onTick: () => void,
};

const mapDispatchToProps = {
    onAttachCar: attachCar,
    onDetachCar: detachCar,
    onEngineReverse: reverseEngine,
    onEngineStart: startEngine,
    onEngineStop: stopEngine,
    onSwitch: trackSwitch,
    onTick: tick,
};

export type ILandProps = ILandMapToStateProps & ILandDispatchToProps;

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(Land);
