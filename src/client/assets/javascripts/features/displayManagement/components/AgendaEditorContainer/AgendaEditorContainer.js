import React, { Component } from 'react';
import { Layout } from 'antd';
import MediaListContainer from '../MediaListContainer';
import CalendarContainer from '../CalendarContainer';

export default class AgendaEditorContainer extends Component {

  render() {
    return (
      <Layout className="display-management-content-layout">
        <Layout.Sider><MediaListContainer /></Layout.Sider>
        <Layout.Content>
          <CalendarContainer />
        </Layout.Content>
      </Layout>
    );
  }
}
