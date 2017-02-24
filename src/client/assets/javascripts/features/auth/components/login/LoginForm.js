import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Alert, Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

const LoginForm = Form.create({

  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },

  mapPropsToFields(props) {
    return {
      email: {
        ...props.email
      },
      password: {
        ...props.password
      },
      rememberMe: {
        ...props.rememberMe
      }
    };
  },
})(
class LoginForm extends Component {

  static propTypes = {
    errors: PropTypes.array,
    form: PropTypes.object.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    validateFields: PropTypes.func,
  };

  /**
   * Lorsque le formulaire est submit, la validité des champs est vérifiée et si
   * tout est convenable, le callback provenant des props est exécuté.
   */
  onSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err) => {
      if (!err) {
        this.props.onSubmit();
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const errorMessages = this.props.errors && this.props.errors.length > 0 && (
      <ul>
        {this.props.errors.map(function(error, index) {
          return <li key={index}>{error}</li>;
        })}
      </ul>
    );

    return (
      <Form onSubmit={this.onSubmit} className="login-form">
        <h1>Connexion</h1>
        {errorMessages && (
          <Alert type="error" message="Echec de la connexion" description={errorMessages} closable />
        )}

        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Veuillez entrer votre adresse e-mail.' }],
          })(
            <Input addonBefore={<Icon type="user" />} placeholder="Addresse e-mail" />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Veuillez entrer votre mot de passe.' }],
          })(
            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Mot de passe" />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('rememberMe', {
            valuePropName: 'checked',
          })(
            <Checkbox>Se souvenir de moi</Checkbox>
          )}
          <Link to="/lost-password" className="login-form-forgot">Mot de passe oublié ?</Link>
          <Button type="primary" htmlType="submit" className="login-form-button" loading={this.props.isLoggingIn}>
            Connexion
          </Button>
          Ou <Link to="/register">créer un compte!</Link>
        </FormItem>
      </Form>
    );
  }
});

export default LoginForm;
