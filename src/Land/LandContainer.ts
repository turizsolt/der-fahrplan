import { startEngine, tick } from 'src/actions';
import { connect } from 'react-redux';
import { Land } from './Land';

const getModel = ((state: any) => state.LandReducer);

const mapStateToProps = (state: any) => ({
    model: getModel(state)
  })
  
  const mapDispatchToProps = {
    onEngineClicked: startEngine,
    onTick: tick
  }
  
  export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(Land);
