import React, { Component, PropTypes } from 'react';
import { Layout} from 'antd';

export default class DisplayManagementContainer extends Component {

  render() {

    return (
      <Layout id={'displayManagementLayout'}>
        <Layout.Content style={{overflowY: 'scroll'}}>
          {this.props.children}
        </Layout.Content>
      </Layout>
    );
  }
}

DisplayManagementContainer.propTypes = {
  children: PropTypes.element.isRequired
};
