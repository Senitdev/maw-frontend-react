import React, { Component } from 'react';

import { LoginFormComponent } from './LoginForm';

import './Login.scss';

export default class LoginContainer extends Component {

  render() {
    const validateFields = (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    };

    return (
      <LoginFormComponent validateFields={validateFields} />
    );
  }
}
