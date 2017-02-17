import React, { Component, PropTypes } from 'react';
import { Layout } from 'antd';
import MediaListContainer from '../MediaListContainer';

export default class PlanningEditorContainer extends Component {

  render() {
    return (
      <Layout>
        <Layout.Sider><MediaListContainer /></Layout.Sider>
        <Layout.Content>
          <Layout.Content>Content</Layout.Content>
        </Layout.Content>
      </Layout>
    );
  }
}
