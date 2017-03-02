import React, { Component, PropTypes } from 'react';
import { Table, Input, Button, Row, Col, Tooltip, Popconfirm } from 'antd';
import { Link } from 'react-router';

import { ModalFileViewer } from '../MediaViewers';

import './DataTable.scss';

export default class DataTable extends Component {

  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
    dataSource: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    onDeleteSelection: PropTypes.func,
    onEdit: PropTypes.func,
    onRefresh: PropTypes.func,
    onSearch: PropTypes.func,
    rowSelection: PropTypes.object,
    title: PropTypes.string,
  };

  render() {

    const columns = [
      ...this.props.columns,
      {
        title: 'Actions',
        key: 'actions',
        width: 115,
        className: 'maw-data-table-actions-column',
        render: (text, record) => (
          <div>
            <ModalFileViewer file={record} />
            { this.props.onEdit &&
            <Tooltip title="Modifier" placement="bottom" mouseEnterDelay={0.6}>
              <Button icon="edit" onClick={() => this.props.onEdit(record.id)} />
            </Tooltip> }
            { this.props.onDelete &&
            <Tooltip title="Supprimer" placement="bottom" mouseEnterDelay={0.6}>
              <Popconfirm title="Supprimer ?" onConfirm={() => this.props.onDelete(record.id)} okText="Oui" cancelText="Non">
                <Button icon="delete" loading={record.isDeleting} />
              </Popconfirm>
            </Tooltip> }
          </div>
        )
      }
    ];

    const { title, onRefresh, onDeleteSelection, onAdd, onSearch } = this.props;

    return (
      <div className="maw-data-table">

        { /* Ligne du titre si nécessaire */ title &&
        <Row style={{marginBottom: '6px'}}>
            <h1>{title}</h1>
            <hr />
        </Row>
        }

        { /* Ligne avec les boutons d'action */
        (onRefresh || onDeleteSelection || onAdd) && (
        <Row style={{marginBottom: '4px'}}>

          <Col span={2} className="maw-data-table-tool-bar">
            { /* Bouton de refresh si nécessaire */ onRefresh &&
            <Tooltip title="Rafraichir les données" placement="bottom" mouseEnterDelay={0.6}>
              <Button loading={this.props.loading} icon="reload" onClick={onRefresh} />
            </Tooltip>
            }
            { /* Bouton de suppression de la sélection si nécessaire */ onDeleteSelection &&
            <Tooltip title="Supprimer la sélection" placement="bottom" mouseEnterDelay={0.6}>
              <Popconfirm title="Supprimer la sélection ?" onConfirm={this.props.onDeleteSelection} okText="Oui" cancelText="Non">
                <Button icon="delete" />
              </Popconfirm>
            </Tooltip>
            }
            { /* Bouton d'ajout si nécessaire */ onAdd &&
            <Tooltip title="Ajouter" placement="bottom" mouseEnterDelay={0.6}>
              <Button type="primary" icon="plus" onClick={onAdd} />
            </Tooltip>
            }
          </Col>

          <Col span={4}>
            { /* Champ de recherche si nécessaire */ onSearch &&
            <Input.Search placeholder="Rechercher" onSearch={onSearch} />
            }
          </Col>
        </Row>
        )}

        { /* Ligne avec la table */ }
        <Row>
          <Col>
            <Table
              loading={this.props.loading}
              columns={columns}
              dataSource={this.props.dataSource}
              rowKey={(record) => record.id}
              rowSelection={this.props.rowSelection} />
          </Col>
        </Row>
      </div>
    );
  }
}
