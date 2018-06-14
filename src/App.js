import React, { Component } from 'react';
import './App.css';
import GameCategory from './GameCategory';
import GameCard from './GameCard';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <GameCategory categoryId="-KyvUJq9mBAU_hd1uvSh" country='default'/>
        <GameCard gameId="100-pandas-1" />
      </div>
    );
  }
}

export default App;
