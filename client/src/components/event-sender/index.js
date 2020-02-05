import React from 'react';
import './index.css';
import { Button, TextInput, toaster } from 'evergreen-ui'
import validUrl from 'valid-url'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
    if (this.props.escapeStep === 4) {
      const deviceId = localStorage.getItem('team-code');
      this.props.sendDeviceMessage(deviceId,"Find the userId who ordered the most items at once where the max order size was under 20 dollars..");
    }
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
      if (this.props.escapeStep !== 5) {
        const url = this.state.inputValue;
        if (validUrl.isUri(url)) {
          fetch('/events/send-one-event', {
            method: 'POST',
            body: JSON.stringify({
              url: url,
              escapeStep: this.props.escapeStep,
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
      } else {
        const writeKey = this.state.inputValue;
        fetch('/events/send-one-event', {
          method: 'POST',
          body: JSON.stringify({
            writeKey: writeKey,
            escapeStep: this.props.escapeStep,
            deviceId: localStorage.getItem('team-code'),
          }),
          headers: {"Content-Type": "application/json"}
        })
          .then(res => res.json())
          .then(() => {
            toaster.success('Event Sent');
          });
      }
    }
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
            this.setState({inputValue: ''});
            this.props.nextEscapeStep();
          } else {
            toaster.warning('WRONG!!');
          }
        });
      this.setState({password: ''});
    }
  }

  updateInputValue(e) {
    this.setState({inputValue: e.target.value});
  }

  updatePassword(e) {
    this.setState({password: e.target.value});
  }

  render() {
    const codeString = `curl -X POST \n
        http://se-data-escape-room.herokuapp.com/deviceApi/messages/push \n
        -H 'Content-Type: application/json' \n
        -H 'Postman-Token: 5c5b9a9c-0c8c-49e7-8877-20496fc392a8' \n
        -H 'cache-control: no-cache' \n
        -d '{
              "deviceId": "12345",
              "message" : "Hello"
      }'`;
    const eventSender = () => {
      return <div className='text-container'>
               <TextInput
                 onChange={this.updateInputValue}
                 onKeyDown={this.sendEvent}
                 placeholder=''
                 value={this.state.inputValue}
               />
               <Button marginLeft={5} appearance="primary" intent="success" onClick={this.sendEvent}>Send</Button>
             </div>
    }
    const stepContent = () => {
      switch(this.props.escapeStep) {

        case 2:  return <div className='step-container'>
                          <div>Step 2: Let's see how you function as a team. Go directly to the source.</div>
                          { eventSender() }
                          <div className='password-container'>
                            <TextInput
                              onChange={this.updatePassword}
                              onKeyDown={this.submitPassword}
                              placeholder='On to the next step?'
                              value={this.state.password}
                            />
                            <Button marginLeft={5} appearance="primary" intent="success" onClick={this.submitPassword}>Submit Password</Button>
                          </div>
                        </div>;
        case 4:  return <div className='step-container'>
                          <div>Step 4: Let's hope your source function is working... You can still test single events here, but if you're confident... SEND IN THE DATA!</div>
                          { eventSender() }
                          <div>
                            <div className='send-in-the-data'>
                              <Button marginLeft={5} intent="danger" onClick={this.sendData}>SEND IN THE DATA!</Button>
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
                        </div>;
        case 5:  return <div>
                          <div>Step 5: Almost at the final destination!</div>
                          <div className='text-container'>
                             <TextInput
                               onChange={this.updateInputValue}
                               onKeyDown={this.sendEvent}
                               placeholder='Enter writeKey...'
                               value={this.state.inputValue}
                             />
                             <Button marginLeft={5} appearance="primary" intent="success" onClick={this.sendEvent}>Send</Button>
                           </div>
                           <div className='code-example-container'>
                             <div className='code-example'>
                              Make a destination function that takes the event and outputs a request similar to below.
                               <SyntaxHighlighter language="javascript" style={docco}>
                                 { codeString }
                               </SyntaxHighlighter>
                             </div>
                           </div>
                        </div>;

        default:  return <h1>what did you do</h1>
      }
    }

    return (
      <div>
      { stepContent() }
      </div>
    );
  }
}
export default EventBuilder;
