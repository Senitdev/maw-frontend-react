import React, { Component, PropTypes } from 'react';
import { Icon, Menu } from 'antd';
const { SubMenu } = Menu;
import { Link } from 'react-router';

import './SideMenu.scss';

export default class SideMenu extends Component {

  static contextTypes = {
      router: React.PropTypes.object
  };

  render() {
    var defaultOpenKeys=[];
    var defaultSelectedKeys=[];
    if (this.context.router.isActive('display-management')) {
      defaultOpenKeys.push("display-management");
      if (this.context.router.isActive('display-management/file')) {
        defaultOpenKeys.push("display-management-media-library");
        defaultSelectedKeys.push("display-management/file");
      } else if (this.context.router.isActive('display-management/scene')) {
        defaultOpenKeys.push("display-management-media-library");
        defaultSelectedKeys.push("display-management/scene");
      } else if (this.context.router.isActive('display-management/screen')) {
        defaultSelectedKeys.push("display-management/display");
      } else if (this.context.router.isActive('display-management/agenda')) {
        defaultSelectedKeys.push("display-management/agenda");
      }
    }

    return (
      <Menu defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys} className={'SideMenu' + (this.props.collapsed ? ' collapsed' : '')} mode={this.props.collapsed ? 'vertical' : 'inline'}>

        <Menu.Item key="dashboard">
          <Icon type="windows" />
          <span className="item-text">Dashboard</span>
        </Menu.Item>

        <SubMenu key="display-management" title={<span><Icon type="video-camera" /><span className="item-text">Afficheurs</span></span>}>
          <SubMenu key="display-management-media-library" title={<span><Icon type='file' />Médiathèque</span>}>

            <Menu.Item key="display-management/file">
              <Link to="/display-management/file"><Icon type="picture" />Fichiers</Link>
            </Menu.Item>

            <Menu.Item key="display-management/scene">
              <Link to="/display-management/scene"><Icon type="appstore-o" />Scènes</Link>
            </Menu.Item>

          </SubMenu>

          <Menu.Item key="display-management/screen">
            <Link to="/display-management/screen"><Icon type="desktop" />Écrans</Link>
          </Menu.Item>

          <Menu.Item key="display-management/agenda">
            <Link to="/display-management/agenda"><Icon type="calendar" />Agendas</Link>
          </Menu.Item>

        </SubMenu>

      </Menu>
    );
  }
}

SideMenu.propTypes = {
  collapsed: PropTypes.bool
};
