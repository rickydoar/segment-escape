import React from 'react';
import './index.css';
import { Button, TextInput, toaster } from 'evergreen-ui'

class TeamCode extends React.Component {
  constructor(props) {
    super(props);
    this.enterTeamCode = this.enterTeamCode.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);

    this.state = {
      inputValue: '',
    };
  }

  enterTeamCode(e) {
    if (e.type === 'click' || e.key === 'Enter') {
      localStorage.setItem('team-code', this.state.inputValue);
      this.props.nextEscapeStep();
    }
  }

  updateInputValue(e) {
    this.setState({inputValue: e.target.value});
  }

  render() {
    return (
      <div className='step-container'>
        Step One... This one should be easy.
        <div className='text-container'>
          <TextInput
            onChange={this.updateInputValue}
            onKeyDown={this.enterTeamCode}
            placeholder='Enter Team Code'
            value={this.state.inputValue}
          />
          <Button marginLeft={5} appearance="primary" intent="success" onClick={this.enterTeamCode}>Start!</Button>
        </div>
      </div>
    );
  }
}
export default TeamCode;
