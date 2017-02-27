import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout } from 'antd';

import { actionCreators as coreActions, selector } from '../../';
import SideMenu from '../SideMenu';

import './ManagementLayout.scss';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators(coreActions, dispatch),
}))
export default class ManagementLayout extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    core: PropTypes.object.isRequired,
  };

  render() {
    const { 'core': { collapsedSideMenu }, 'actions': { collapseSideMenu } } = this.props;

    return (
      <Layout id="ManagementLayout">
        <Layout.Sider collapsible
                      collapsed={collapsedSideMenu}
                      onCollapse={collapseSideMenu}>
          <div className="siderContent">
            <SideMenu collapsed={collapsedSideMenu} />
          </div>
        </Layout.Sider>
        <Layout.Content>
          {this.props.children}
        </Layout.Content>
      </Layout>
    );
  }
}
