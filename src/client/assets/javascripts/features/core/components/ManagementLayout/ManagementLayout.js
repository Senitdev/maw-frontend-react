import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Menu, Icon, Col, Dropdown, Button } from 'antd';
import { Link } from 'react-router';

import { actionCreators as coreActions, selector } from '../../';
import SideMenu from '../SideMenu';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators(coreActions, dispatch)
}))
export default class ManagementLayout extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    core: PropTypes.object.isRequired,
  };

  render() {
    const { 'core': { collapsedSideMenu }, 'actions': { collapseSideMenu }} = this.props;
    const menu = (
      <Menu>
        <Menu.Item>
          <Link to="/login">Logout <Icon type="logout" /></Link>
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout id={'coreLayout'}>
        <Layout.Header>
          <Col span={23}>My Access Web</Col>
          <Col span={1}>
            <Dropdown overlay={menu} placement="bottomRight">
              <Button type="primary" shape="circle" icon="user" size="large" />
            </Dropdown>
          </Col>
        </Layout.Header>
        <Layout>
          <Layout.Sider collapsible
                        collapsed={collapsedSideMenu}
                        onCollapse={collapseSideMenu}
                        style={{zIndex: '2', bottom: '0'}}>
            <SideMenu collapsed={collapsedSideMenu} />
          </Layout.Sider>
          <Layout.Content style={{zIndex: '1'}}>
            {this.props.children}
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}
