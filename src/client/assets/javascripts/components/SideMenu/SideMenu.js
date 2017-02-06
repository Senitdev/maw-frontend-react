import React, { Component, PropTypes } from 'react';
import { Icon, Menu } from 'antd';
const { SubMenu } = Menu;
import { Link } from 'react-router';

import './SideMenu.scss';

export default class SideMenu extends Component {

  render() {
    return (
      <Menu className={'SideMenu' + (this.props.collapsed ? ' collapsed' : '')} theme="dark" mode={this.props.collapsed ? 'vertical' : 'inline'}>

        <Menu.Item key="dashboard">
          <Icon type="windows" />
          <span className="item-text">Dashboard</span>
        </Menu.Item>

        <SubMenu key="display-management" title={<span><Icon type="video-camera" /><span className="item-text">Afficheurs</span></span>}>
          <Menu.Item key="display-management-media-library">
            <Link to="/display-management/image">Médiathèque</Link>
          </Menu.Item>
          <Menu.Item key="display-management-display">
            <Link to="/display-management/display">Écrans</Link>
          </Menu.Item>
          <Menu.Item key="display-management-planning">
            <Link to="/display-management/planning">Plannings</Link>
          </Menu.Item>
        </SubMenu>

      </Menu>
    );
  }
}

SideMenu.propTypes = {
  collapsed: PropTypes.bool
};
