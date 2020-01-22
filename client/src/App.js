import React, { Component } from 'react';
import EventSender from './components/event-sender/index';
import TeamCode from './components/team-code/index';
import ArduinoBoard from './components/arduino-board/index';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.nextEscapeStep = this.nextEscapeStep.bind(this);
    this.state = {
      escapeStep: 1,
    }
  }

  componentDidMount() {
    const escapeStep = localStorage.getItem('escape-step');
    if (escapeStep) {
      this.setState({escapeStep: parseInt(escapeStep, 10)});
    }
  }

  nextEscapeStep() {
    const escapeStep = this.state.escapeStep + 1;
    localStorage.setItem('escape-step', escapeStep);
    this.setState({escapeStep});
  }

  render() {
    const escapeStep = () => {
      switch(this.state.escapeStep) {

        case 1:  return <TeamCode nextEscapeStep={this.nextEscapeStep}/>;
        case 2:  return <EventSender nextEscapeStep={this.nextEscapeStep} escapeStep={this.state.escapeStep}/>;
        case 3:  return <EventSender nextEscapeStep={this.nextEscapeStep} escapeStep={this.state.escapeStep}/>;
        case 4:  return <ArduinoBoard />;

        default:  return <h1>what did you do</h1>
      }
    }

    return (
      <div className="App">
        <div className="title">
          Welcome to the Segment Data Challenge
        </div>
        <div> { escapeStep() } </div>
      </div>
    );
  }
}

export default App;
