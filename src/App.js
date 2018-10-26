import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Typer from './components/typer';
import Typist from './components/typist';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Typist/>        
      </div>
    );
  }
}

export default App;
