import React, { Component, PropTypes } from 'react';
import { Col, Row } from 'antd';

import './TablePage.scss';

/**
 * Représante une page contenant une table. Sert principalement de layout.
 */
export default class TablePage extends Component {

  static propTypes = {
    children: PropTypes.array,
  };

  render() {
    return (
      <Row className="maw-table-page">
        <Col offset={1} span={22}>
           { this.props.children }
        </Col>
      </Row>
    );
  }
}

/**
 * Higher-Order-Component englobant un composant dans un TablePage.
 */
export const inTablePage = (WrappedComponent) => class extends Component {

  static displayName = `inTablePage(${WrappedComponent.displayName})`;

  render() {
    return (
      <TablePage>
        <WrappedComponent {...this.props} />;
      </TablePage>
    );
  }
}
