import React, { Component } from 'react';
import { connect } from './store';
import logo from './images/remodule.png';

class App extends Component {
  componentWillMount () {
    // test setting state
    this.props.setModule1Size('Large');
    this.props.setModule1UiSettings({
      isSettingsModalOpen: true
    });
    this.props.setTheme('dark');
    this.props.setModule2Living('Opole');
    this.props.setModule1Status('Online');
    this.props.setCountry('UK');
    this.props.setModule2({
      name: 'otis',
      address: {
        line1: '1 Big House',
        line2: 'Big place Avenue'
      }
    });
  }

  render () {
    const {
      theme,
      uiSettings: { isSettingsModalOpen },
      size,
      living,
      country,
      address: { line1, line2 },
      name,
      status
    } = this.props;
    return (
      <div>
        <div>
          <img src={logo} />
          <h2>{this.props.test1}</h2>
        </div>
        <ul>
          <li>theme: {theme}</li>
          <li>size: {size}</li>
          <li>status: {status}</li>
          <li>living: {living}</li>
          <li>country: {country}</li>
          <li>name: {name}</li>
          Address
          <li>line1: {line1}</li>
          <li>line2: {line2}</li>
        </ul>
      </div>
    );
  }
}

export default connect(App);
