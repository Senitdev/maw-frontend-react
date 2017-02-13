import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

class LoginForm extends Component {

  static propTypes = {
    form: PropTypes.object.isRequired,
    validateFields: PropTypes.func.isRequired,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(this.props.validateFields);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <h1>My Acess Web</h1>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Veuillez entrer votre adresse emai!' }],
          })(
            <Input addonBefore={<Icon type="user" />} placeholder="Email" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Veuillez entrer votre mot de passe!' }],
          })(
            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Rester connecté</Checkbox>
          )}
          <a className="login-form-forgot">Mot de passe oublié ?</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Connexion
          </Button>
          Ou <Link to="/register">créer un compte!</Link>
        </FormItem>
      </Form>
    );
  }
}

export const LoginFormComponent = Form.create()(LoginForm);
