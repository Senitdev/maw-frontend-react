import React, { Component, PropTypes } from 'react';
import { Layout } from 'antd';
import MediaListContainer from '../MediaListContainer';
import CalendarContainer from '../CalendarContainer';

export default class PlanningEditorContainer extends Component {

  render() {
    return (
      <Layout style={{ height: 'auto' }}>
        <Layout.Sider><MediaListContainer /></Layout.Sider>
        <Layout.Content>
          <Layout.Content><CalendarContainer /></Layout.Content>
        </Layout.Content>
      </Layout>
    );
  }
}
