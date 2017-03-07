import React, { Component, PropTypes } from 'react';
import { Layout } from 'antd';
import MediaListContainer from '../MediaListContainer';
import CalendarContainer from '../CalendarContainer';

export default class AgendaEditorContainer extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired
  };

  render() {
    return (
      <Layout className="display-management-content-layout">
        <Layout.Sider width="auto"><MediaListContainer /></Layout.Sider>
        <Layout.Content>
          <CalendarContainer idAgenda={this.props.params.idAgenda} />
        </Layout.Content>
      </Layout>
    );
  }
}
