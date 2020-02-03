import React from 'react';
import './index.css';
import { Button, toaster, TextInput } from 'evergreen-ui'

const OP_SOUND = "OP_SOUND";

function sendDeviceMessage(deviceId, message) {
  fetch('/deviceApi/messages/push', {
    method: 'POST',
    body: JSON.stringify({
      deviceId: deviceId,
      message: message
    }),
    headers: {"Content-Type": "application/json"}
  });
}

function sendDeviceSound(deviceId) {
  sendDeviceMessage(deviceId,OP_SOUND)
}

class ArduinoBoard extends React.Component {
  constructor(props) {
    super(props);
    this.pingArduino = this.pingArduino.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.submitPassword = this.submitPassword.bind(this);

    this.state = {
      inputValue: '',
      password: '',
      dataFlowing: false,
    };
  }

  pingArduino() {
    toaster.success('Ping!');
    console.log("Ping!");

    var thisUrl = window.location.href + "/deviceApi";
    sendDeviceMessage("12345","Welcome!");
    sendDeviceSound("12345");
  }

  submitPassword(e) {
    if (e.type === 'click' || e.key === 'Enter') {
      fetch('/password', {
        method: 'POST',
        body: JSON.stringify({
          password: this.state.password,
          escapeStep: this.props.escapeStep,
        }),
        headers: {"Content-Type": "application/json"}
      })
        .then(res => res.json())
        .then(body => {
          if (body.success) {
            this.props.nextEscapeStep();
          } else {
            toaster.warning('WRONG!!');
          }
        });
      this.setState({password: ''});
    }
  }

  updatePassword(e) {
    this.setState({password: e.target.value});
  }

  render() {
    return (
      <div className='step-container'>
        Step 3: Listen closely, the answer is near.
        <div className='text-container'>
          <Button marginLeft={5} intent="danger" onClick={this.pingArduino}>Listen...</Button>
        </div>
        <div className='password-container'>
          <TextInput
            onChange={this.updatePassword}
            onKeyDown={this.submitPassword}
            placeholder='On to the next step?'
            value={this.state.password}
          />
          <Button marginLeft={5} appearance="primary" intent="success" onClick={this.submitPassword}>Submit Password</Button>
        </div>
      </div>
    );
  }
}
export default ArduinoBoard;
