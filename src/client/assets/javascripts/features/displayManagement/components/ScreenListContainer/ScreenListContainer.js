import React, { Component } from 'react';
import { Icon, Col, Row, Tooltip } from 'antd';

import MediaTableContainer from '../MediaTableContainer';

import './ScreenListContainer.scss';

export default class ScreenListContainer extends Component {

  onAdd = () => {
    // TODO: Callback bouton "Nouvel écran"
    console.log('Nouvel écran cliqué');
  }

  onEdit = (id) => {
    // TODO: Callback bouton "Modifier écran"
    console.log(`Modifier écran ${id} cliqué`);
  }

  render() {

    const maxTimeWithoutPull = 1000 * 60 * 5;

    function statusColumnRender(screen) {
      if (Date.now() - screen.lastPull.getTime() > maxTimeWithoutPull) {
        return (
          <Tooltip title="Écran déconnecté" mouseEnterDelay={0.5}>
            <div className="ant-alert-error"><Icon type="laptop" /></div>
          </Tooltip>
        );
      }
      return (
        <Tooltip title="Écran connecté" mouseEnterDelay={0.5}>
          <div className="ant-alert-success"><Icon type="laptop" /></div>
        </Tooltip>
      );
    }

    const columns = [
      {
        title: 'Status',
        key: 'status',
        className: 'screen-status',
        render: statusColumnRender
      }
    ];

    return (
      <div>
        <Row>
          <Col offset={1} span={22}>
            <h1>Écrans</h1>
            <hr style={{marginBottom: '4px'}} />
            <MediaTableContainer
              mediaType="screen"
              columns={columns}
              onAdd={this.onAdd}
              onEdit={this.onEdit} />
          </Col>
        </Row>
      </div>
    );
  }
}
