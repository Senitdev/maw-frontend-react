import React, { Component } from 'react';

import { RegisterFormComponent } from './RegisterForm';

import './Register.scss';

export default class RegisterContainer extends Component {

  render() {
    const validateFields = (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    };

    return (
      <RegisterFormComponent validateFields={validateFields} />
    );
  }
}
