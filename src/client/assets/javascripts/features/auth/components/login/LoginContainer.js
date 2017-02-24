import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import { actionCreators as authActions, selector } from '../../';
import LoginForm from './LoginForm';

import './Login.scss';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators(authActions, dispatch)
}))
@withRouter
export default class LoginContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    // Stock les champs du formulaire de login dans l'état local
    this.state = {
      fields: {
        email: {
          value: '',
        },
        password: {
          value: '',
        },
        rememberMe: {
          value: false,
        }
      }
    };
  }

  componentWillMount() {
    const remember = localStorage.getItem('auth.remember');

    // Initialise l'addresse e-mail et la case à cocher si l'utilisateur à décidé de s'en souvenir
    this.setState({
      fields: {
        ...this.state.fields,
        email: {
          value: remember ? remember : ''
        },
        rememberMe: {
          value: !!remember
        }
      }
    });
  }

  componentWillReceiveProps(nextProps) {

    // Redirige sur la route principale si l'utilisateur s'est authentifié
    if (nextProps.auth.loggedIn) {
      this.props.router.push('/');
    }
  }

  /**
   * Met à jour la valeur des champs modifiés dans l'état local.
   */
  handleFormChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields },
    });
  }

  /**
   * Déclenche l'action de "login" lorsque le formulaire est submit.
   */
  onSubmit = () => {
    const { email, password, rememberMe } = this.state.fields;
    this.props.actions.login(email.value, password.value, rememberMe.value);
  }

  render() {
    return (
      <LoginForm {...this.state.fields}
        errors={this.props.auth.loginErrors}
        onChange={this.handleFormChange}
        onSubmit={this.onSubmit}
        isLoggingIn={this.props.auth.isLoggingIn} />
    );
  }
}
