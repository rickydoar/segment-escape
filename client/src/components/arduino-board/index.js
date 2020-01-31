import React from 'react';
import './index.css';
import { Button, toaster } from 'evergreen-ui'

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
  }

  pingArduino() {
    toaster.success('Ping!');
    console.log("Ping!");

    var thisUrl = window.location.href + "/deviceApi";
    sendDeviceMessage("12345","Welcome!");
    sendDeviceSound("12345");

  }

  render() {
    return (
      <div className='step-container'>
        Step Four: Listen closely, the answer is near.
        <div className='text-container'>
          <Button marginLeft={5} intent="danger" onClick={this.pingArduino}>Listen...</Button>
        </div>
      </div>
    );
  }
}
export default ArduinoBoard;
