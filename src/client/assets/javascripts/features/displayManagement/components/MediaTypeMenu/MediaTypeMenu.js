import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu, Icon } from 'antd';

export default class MediaTypeMenu extends Component {

  render() {
    return (
      <Menu mode="inline">
        <Menu.ItemGroup title="Fichiers">
          <Menu.Item key="image">
            <Link to="/display-management/image"><Icon type="picture" /> Images</Link>
          </Menu.Item>
          <Menu.Item key="video">
            <Link to="/display-management/video"><Icon type="video-camera" /> Vidéos</Link>
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.Divider />
        <Menu.Item key="scene">
          <Link to="/display-management/scene"><Icon type="appstore" />Scènes</Link>
        </Menu.Item>
      </Menu>
    );
  }
}
