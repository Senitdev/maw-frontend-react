import React, { Component, PropTypes } from 'react';
import { Layout } from 'antd';

export default class DisplayManagementContainer extends Component {

  render() {
    return (
      <Layout id={'displayManagementLayout'}>
        <Layout.Header>Titre TODO: le rendre dynamic</Layout.Header>
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
