import React, { Component } from 'react';
import { Col, Row } from 'antd';

import MediaTableContainer from '../MediaTableContainer';

export default class FileListContainer extends Component {

  onAdd = () => {
    // TODO: Callback bouton "Nouveau fichier"
    console.log('Nouveau fichier cliqué');
  }

  onEdit = (id) => {
    // TODO: Callback bouton "Modifier fichier"
    console.log(`Modifier fichier ${id} cliqué`);
  }

  render() {

    const columns = [
      {
        title: 'Résolution',
        key: 'resolution',
        render: (file) => `${file.width}x${file.height} (px)`,
      },
      {
        title: 'Poid',
        key: 'weight',
        sorter: (a, b) => b.weight - a.weight,
        render: (file) => `${file.weight} (Ko)`
      },
      {
        title: 'mimetype',
        dataIndex: 'mimetype',
        key: 'mimetype',
        sorter: (a, b) => b.mimetype.localeCompare(a.mimetype),
      }
    ];

    return (
      <div>
        <Row>
          <Col offset={1} span={22}>
            <h1>Fichiers</h1>
            <hr style={{marginBottom: '4px'}} />
            <MediaTableContainer
              mediaType="file"
              columns={columns}
              onAdd={this.onAdd}
              onEdit={this.onEdit} />
          </Col>
        </Row>
      </div>
    );
  }
}
