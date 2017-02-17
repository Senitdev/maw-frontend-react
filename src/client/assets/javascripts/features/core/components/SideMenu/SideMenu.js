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
      if (this.context.router.isActive('display-management/image')) {
        defaultOpenKeys.push("display-management-media-library");
        defaultSelectedKeys.push("display-management/image");
      } else if (this.context.router.isActive('display-management/video')) {
        defaultOpenKeys.push("display-management-media-library");
        defaultSelectedKeys.push("display-management/video");
      } else if (this.context.router.isActive('display-management/scene')) {
        defaultOpenKeys.push("display-management-media-library");
        defaultSelectedKeys.push("display-management/scene");
      } else if (this.context.router.isActive('display-management/display')) {
        defaultSelectedKeys.push("display-management/display");
      } else if (this.context.router.isActive('display-management/planning')) {
        defaultSelectedKeys.push("display-management/planning");
      }
    }

    return (
      <Menu defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys} className={'SideMenu' + (this.props.collapsed ? ' collapsed' : '')} theme="dark" mode={this.props.collapsed ? 'vertical' : 'inline'}>

        <Menu.Item key="dashboard">
          <Icon type="windows" />
          <span className="item-text">Dashboard</span>
        </Menu.Item>

        <SubMenu key="display-management" title={<span><Icon type="video-camera" /><span className="item-text">Afficheurs</span></span>}>
          <SubMenu key="display-management-media-library" title={<span><Icon type='file' />Médiathèque</span>}>

            <Menu.Item key="display-management/image">
              <Link to="/display-management/image"><Icon type="picture" />Images</Link>
            </Menu.Item>

            <Menu.Item key="display-management/video">
              <Link to="/display-management/video"><Icon type="video-camera" />Vidéos</Link>
            </Menu.Item>

            <Menu.Item key="display-management/scene">
              <Link to="/display-management/scene"><Icon type="appstore-o" />Scènes</Link>
            </Menu.Item>

          </SubMenu>

          <Menu.Item key="display-management/display">
            <Link to="/display-management/display"><Icon type="desktop" />Écrans</Link>
          </Menu.Item>

          <Menu.Item key="display-management/planning">
            <Link to="/display-management/planning"><Icon type="calendar" />Plannings</Link>
          </Menu.Item>

        </SubMenu>

      </Menu>
    );
  }
}

SideMenu.propTypes = {
  collapsed: PropTypes.bool
};
