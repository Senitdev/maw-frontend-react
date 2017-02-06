import React, { Component, PropTypes } from 'react';
import { Layout } from 'antd';
const { Sider, Content } = Layout;

import SideMenu from 'components/SideMenu';

export default class ManagementLayout extends Component {

  constructor(props) {
    super(props);

    this.state = {
      collapsedMenu: false
    };
  }

  onMenuToggle = (collapsedMenu) => {
    this.setState({ collapsedMenu });
  }

  render() {
    return (
      <Layout>
        <Sider collapsible collapsed={this.state.collapsedMenu} onCollapse={this.onMenuToggle}>
          <SideMenu collapsed={this.state.collapsedMenu} />
        </Sider>
        <Content style={{ margin: '16px 16px' }}>
          {this.props.children}
        </Content>
      </Layout>
    );
  }
}

ManagementLayout.propTypes = {
  children: PropTypes.element.isRequired
};
