import React, { Component } from 'react';
import EventSender from './components/event-sender/index';
import TeamCode from './components/team-code/index';
import ArduinoBoard from './components/arduino-board/index';
import AdminPanel from './components/admin-panel/index';

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
    const teamCode = localStorage.getItem('team-code');
    if(teamCode=="-1") {
      const escapeStep = -1;
      localStorage.setItem('escape-step', escapeStep);
      this.setState({escapeStep});
    } else {
      const escapeStep = this.state.escapeStep + 1;
      localStorage.setItem('escape-step', escapeStep);
      this.setState({escapeStep});
    }
  }

  sendDeviceMessage(deviceId, message) {
    fetch('/deviceApi/messages/push', {
      method: 'POST',
      body: JSON.stringify({
        deviceId: deviceId,
        message: message
      }),
      headers: {"Content-Type": "application/json"}
    });
  }

  render() {
    const escapeStep = () => {
      switch(this.state.escapeStep) {

        case 1:  return <TeamCode nextEscapeStep={this.nextEscapeStep}/>;
        case 2:  return <EventSender nextEscapeStep={this.nextEscapeStep} escapeStep={this.state.escapeStep} sendDeviceMessage={this.sendDeviceMessage}/>;
        case 3:  return <ArduinoBoard nextEscapeStep={this.nextEscapeStep} escapeStep={this.state.escapeStep} sendDeviceMessage={this.sendDeviceMessage}/>;
        case 4:  return <EventSender nextEscapeStep={this.nextEscapeStep} escapeStep={this.state.escapeStep} sendDeviceMessage={this.sendDeviceMessage}/>;
        case 5:  return <EventSender nextEscapeStep={this.nextEscapeStep} escapeStep={this.state.escapeStep} sendDeviceMessage={this.sendDeviceMessage}/>;
        case -1: return <AdminPanel/>;

        default:  return <h1>what did you do</h1>
      }
    }

    const teamCode = () => {
      const code = localStorage.getItem('team-code');
      if (code) {
        if(code=="-1") {
          return "Admin Mode";
        } else {
          return "Team code: " + code;
        }
      }
      return "";
    }

    return (
      <div className="App">
        <div className="title">
          Welcome to the Segment Data Challenge
        </div>
        <div className="team-code"> { teamCode() } </div>
        <div> { escapeStep() } </div>
      </div>
    );
  }
}

export default App;
