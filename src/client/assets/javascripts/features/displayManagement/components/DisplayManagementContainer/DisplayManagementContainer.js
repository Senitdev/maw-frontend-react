import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Layout, Breadcrumb, Icon } from 'antd';

export default class DisplayManagementContainer extends Component {

  pathConnection(path) {
    switch (path) {
      case 'image':
        return 'Images';
      case 'video':
        return 'Vidéos';
      case 'scene':
        return 'Scènes';
      case 'display':
        return 'Écrans';
      case 'planning':
        return 'Agendas';
      default:
        return path;
    }
  }

  render() {
    const paths = location.pathname.split('/');
    var pathsView = [];
    for (var i=0; i < paths.length; i++) {
      if (paths[i] !== 'display-management' && paths[i] !== '')
        pathsView.push(
          <Breadcrumb.Item key={paths[i]}>
            <Link to={'/display-management/' + paths[i]}> {this.pathConnection(paths[i])} </Link>
          </Breadcrumb.Item>
        );
    }

    return (
      <Layout id={'displayManagementLayout'}>
        <Layout.Header>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="home" />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Icon type="video-camera" />
              <span>Afficheurs</span>
            </Breadcrumb.Item>
            {pathsView}
          </Breadcrumb>
        </Layout.Header>
        <Layout.Content>
          {this.props.children}
        </Layout.Content>
      </Layout>
    );
  }
}

DisplayManagementContainer.propTypes = {
  children: PropTypes.element.isRequired
};
