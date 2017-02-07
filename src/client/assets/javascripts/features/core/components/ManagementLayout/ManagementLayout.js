import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout } from 'antd';
const { Sider, Content } = Layout;

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

    return (
      <Layout>
        <Sider collapsible collapsed={collapsedSideMenu} onCollapse={collapseSideMenu} style={{zIndex: '2'}}>
          <SideMenu collapsed={collapsedSideMenu} />
        </Sider>
        <Content style={{zIndex: '1'}}>
          {this.props.children}
        </Content>
      </Layout>
    );
  }
}
