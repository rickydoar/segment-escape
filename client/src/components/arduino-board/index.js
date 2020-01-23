import React from 'react';
import './index.css';
import { Button, toaster } from 'evergreen-ui'

class ArduinoBoard extends React.Component {
  constructor(props) {
    super(props);
    this.pingArduino = this.pingArduino.bind(this);
  }

  pingArduino() {
    console.log("pinggggg");
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
