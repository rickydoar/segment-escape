import React from 'react';
import './index.css';
import { Button, TextInput, toaster } from 'evergreen-ui'
import validUrl from 'valid-url'

class EventBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.sendData = this.sendData.bind(this);
    this.sendEvent = this.sendEvent.bind(this);
    this.submitPassword = this.submitPassword.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.updatePassword = this.updatePassword.bind(this);

    this.state = {
      inputValue: '',
      password: '',
      dataFlowing: false,
    };
  }

  componentDidMount() {
  }

  sendData() {
    const url = this.state.inputValue;
    if (validUrl.isUri(url) && !this.state.dataFlowing) {
      this.setState({dataFlowing: true});
      toaster.success('Data is now flowing...');
      fetch('/events/send-data', {
        method: 'POST',
        body: JSON.stringify({
          url: url,
        }),
        headers: {"Content-Type": "application/json"}
      })
        .then(res => res.json())
        .then(() => {
          console.log("done");
          this.setState({dataFlowing: false});
        });
    } else {
      toaster.warning('That is not a valid url.')
    }
  }

  sendEvent(e) {
    if (e.type === 'click' || e.key === 'Enter') {
      const url = this.state.inputValue;
      if (validUrl.isUri(url)) {
        fetch('/events/send-one-event', {
          method: 'POST',
          body: JSON.stringify({
            url: url,
          }),
          headers: {"Content-Type": "application/json"}
        })
          .then(res => res.json())
          .then(() => {
            toaster.success('Event Sent');
          });
      } else {
        toaster.warning('That is not a valid url.')
      }
    }
  }

  submitPassword(e) {
    if (e.type === 'click' || e.key === 'Enter') {
      fetch('/password', {
        method: 'POST',
        body: JSON.stringify({
          password: this.state.password,
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
    }
  }

  updateInputValue(e) {
    this.setState({inputValue: e.target.value});
  }

  updatePassword(e) {
    this.setState({password: e.target.value});
  }

  render() {
    return (
      <div className='step-container'>
        {this.props.escapeStep === 2 ? (
          <div>Step 2: Let's see how you function as a team. Go directly to the source.</div>
        ) : (
          <div>Step 3: Let's hope your source function is working... You can still test single events here, but if you're confident... SEND IN THE DATA!</div>
        )}
        <div className='text-container'>
          <TextInput
            onChange={this.updateInputValue}
            onKeyDown={this.sendEvent}
            placeholder='Enter URL'
            value={this.state.inputValue}
          />
          <Button marginLeft={5} appearance="primary" intent="success" onClick={this.sendEvent}>Send</Button>
        </div>

        {this.props.escapeStep === 2 ? (
            <div className='password-container'>
              <TextInput
                onChange={this.updatePassword}
                onKeyDown={this.submitPassword}
                placeholder='On to the next step?'
                value={this.state.password}
              />
              <Button marginLeft={5} appearance="primary" intent="success" onClick={this.submitPassword}>Submit Password</Button>
            </div>
          ) : (
            <div className='send-in-the-data'>
              <Button marginLeft={5} intent="danger" onClick={this.sendData}>SEND IN THE DATA!</Button>
            </div>
          )}
      </div>
    );
  }
}
export default EventBuilder;
