import React, { Component } from 'react';
import { Layout } from 'antd';

import MediaTypeMenu from '../MediaTypeMenu';

export default class MediaLibraryContainer extends Component {

  render() {
    return (
      <Layout>
        <Layout.Header>Médias</Layout.Header>
        <Layout>
          <Layout.Sider>
            <MediaTypeMenu />
          </Layout.Sider>
        </Layout>
      </Layout>
    );
  }
}
