import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Menu, Icon, Col, Dropdown, Button } from 'antd';

import { actionCreators as authActions, selector } from 'features/auth';

import './AppHeader.scss';
import logo from 'images/LogoMAWwTxt.png';

@connect(selector, (dispatch) => ({
  authActions: bindActionCreators(authActions, dispatch),
}))
export default class AppHeader extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
  };

  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={this.props.authActions.logout}><Icon type="logout" /> Déconnexion</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout.Header id="AppHeader">
        <Col span={23}>
          <img src={logo} id='logo' />
        </Col>
        <Col span={1}>
          {this.props.auth.loggedIn && (
          <Dropdown overlay={menu} placement="bottomRight">
            <Button type="primary" shape="circle" icon="user" size="large" />
          </Dropdown>
          )}
        </Col>
      </Layout.Header>
    );
  }
}
