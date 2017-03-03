import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Col, Row } from 'antd';

import MediaTableContainer from '../MediaTableContainer';

@withRouter
export default class AgendaListContainer extends Component {

  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  onAdd = () => {
    this.props.router.push('/display-management/agenda/new');
  }

  onEdit = (id) => {
    this.props.router.push('/display-management/agenda/' + id);
  }

  render() {

    return (
      <div>
        <Row>
          <Col offset={1} span={22}>
            <h1>Agendas</h1>
            <hr style={{marginBottom: '4px'}} />
            <MediaTableContainer
              mediaType="agenda"
              onAdd={this.onAdd}
              onEdit={this.onEdit} />
          </Col>
        </Row>
      </div>
    );
  }
}
