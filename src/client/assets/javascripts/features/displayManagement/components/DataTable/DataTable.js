import React, { Component, PropTypes } from 'react';
import { Table, Input, Button, Row, Col, Tooltip, Popconfirm } from 'antd';

import TitleBar from '../TitleBar';
import ActionsCell from './ActionsCell';

import './DataTable.scss';

export default class DataTable extends Component {

  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    onDeleteSelection: PropTypes.func,
    onEdit: PropTypes.func,
    onEditSelection: PropTypes.func,
    onPreview: PropTypes.func,
    onRefresh: PropTypes.func,
    onSearch: PropTypes.func,
    title: PropTypes.string,
  };

  render() {

    const { columns, loading, onAdd, onDelete, onDeleteSelection, onEditSelection, onEdit, onPreview, onRefresh, onSearch, title, ...otherProps} = this.props;

    const tableColumns = (onDelete || onEdit || onPreview ?
      columns.concat({
        title: 'Actions',
        key: 'actions',
        width: 115,
        className: 'maw-data-table-actions-column',
        render: (text, record) => <ActionsCell onDelete={onDelete} onEdit={onEdit} onPreview={onPreview} record={record} />
      })
      :
      columns
    );

    return (
      <div className="maw-data-table">

        { /* Ligne du titre si nécessaire */ title &&
        <TitleBar title={title} />
        }

        { /* Ligne avec les boutons d'action */
        (onRefresh || onEditSelection || onDeleteSelection || onAdd || onSearch) && (
        <Row style={{marginBottom: '4px'}}>

          <Col span={3} className="maw-data-table-tool-bar">
            { /* Bouton de refresh si nécessaire */ onRefresh &&
            <Tooltip title="Rafraichir les données" placement="bottom" mouseEnterDelay={0.6}>
              <Button loading={loading} icon="reload" onClick={onRefresh} />
            </Tooltip>
            }
            { /* Bouton d'édition de la sélection si nécessaire */ onEditSelection &&
            <Tooltip title="Edition de la sélection" placement="bottom" mouseEnterDelay={0.6}>
              <Popconfirm title="Editer la sélection ?" onConfirm={onEditSelection} okText="Oui" cancelText="Non">
                <Button icon="edit" />
              </Popconfirm>
            </Tooltip>
            }
            { /* Bouton de suppression de la sélection si nécessaire */ onDeleteSelection &&
            <Tooltip title="Supprimer la sélection" placement="bottom" mouseEnterDelay={0.6}>
              <Popconfirm title="Supprimer la sélection ?" onConfirm={onDeleteSelection} okText="Oui" cancelText="Non">
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
              columns={tableColumns}
              loading={loading}
              rowKey={(record) => record.id}
              {...otherProps} />
          </Col>
        </Row>
      </div>
    );
  }
}
