import React, { Component, PropTypes } from 'react';
import { Layout } from 'antd';

import MediaTypeMenu from '../MediaTypeMenu';

export default class MediaLibraryContainer extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <Layout>
        <Layout.Header>Médias</Layout.Header>
        <Layout>
          <Layout.Sider style={{backgroundColor: '#fff'}}>
            <MediaTypeMenu />
          </Layout.Sider>
          <Layout.Content>
            {this.props.children}
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}
