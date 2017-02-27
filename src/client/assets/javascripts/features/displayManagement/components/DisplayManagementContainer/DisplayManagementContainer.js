import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Layout, Breadcrumb, Icon } from 'antd';

export default class DisplayManagementContainer extends Component {

  pathConnection(path) {
    switch (path) {
      case 'file':
        return 'Fichiers';
      case 'scene':
        return 'Scènes';
      case 'screen':
        return 'Écrans';
      case 'agenda':
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
            { (i < 3) ?
              <Link to={'/display-management/' + paths[i]}> {this.pathConnection(paths[i])} </Link>
              :
              <span> {this.pathConnection(paths[i])} </span>
            }
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
        <Layout.Content style={{paddingRight: '17px'}}>
          {this.props.children}
        </Layout.Content>
      </Layout>
    );
  }
}

DisplayManagementContainer.propTypes = {
  children: PropTypes.element.isRequired
};
