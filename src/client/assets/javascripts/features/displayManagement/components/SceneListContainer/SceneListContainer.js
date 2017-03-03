import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Col, Row } from 'antd';

import MediaTableContainer from '../MediaTableContainer';

@withRouter
export default class SceneListContainer extends Component {

  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  onAdd = () => {
    this.props.router.push('/display-management/scene/new');
  }

  onEdit = (id) => {
    this.props.router.push('/display-management/scene/' + id);
  }

  render() {

    return (
      <div>
        <Row>
          <Col offset={1} span={22}>
            <h1>Scènes</h1>
            <hr style={{marginBottom: '4px'}} />
            <MediaTableContainer
              mediaType="scene"
              onAdd={this.onAdd}
              onEdit={this.onEdit} />
          </Col>
        </Row>
      </div>
    );
  }
}
