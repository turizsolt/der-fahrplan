import * as React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';
import LandContainer from './Land/LandContainer';

declare var window:any;

class App extends React.Component {
  private store:any;

  public constructor(props:{}) {
    super(props);
    this.store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  }

  public render() {
    return (
      <div className="App">
        <Provider store={this.store}>
          <LandContainer />
        </Provider>
      </div>
    );
  }
}

export default App;
