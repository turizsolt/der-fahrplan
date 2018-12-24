import * as React from 'react';
import './App.css';
import { Track } from './Tiles/Track';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Track />
        <Track />
        <Track />
        <Track />
      </div>
    );
  }
}

export default App;
