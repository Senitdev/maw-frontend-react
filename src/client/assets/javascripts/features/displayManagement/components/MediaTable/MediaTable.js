import React, { Component, PropTypes } from 'react';

import DataTable from '../DataTable';
import { EditableCell } from '../DataTable/EditableCell';

export default class MediaTable extends Component {

  static propTypes = {
    columns: PropTypes.array,
    dataSource: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    onDeleteSelection: PropTypes.func,
    onEdit: PropTypes.func,
    onNameEdit: PropTypes.func,
    onRefresh: PropTypes.func,
    onSearch: PropTypes.func,
    rowSelection: PropTypes.object,
  };

  generateColumns() {
    let columns = {
      id: {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 44,
        sorter: (a, b) => b.id - a.id
      },
      name: {
        title: 'Nom',
        dataIndex: 'name',
        key: 'name',
        width: 350,
        sorter: (a, b) => b.name.localeCompare(a.name, undefined, { sensitivity: 'accent' }),
        render: (text, media) => (this.props.onNameEdit ? <EditableCell media={media} field={'name'} editMedia={this.props.onNameEdit} /> : media.name)
      },
      ratio: {
        title: 'Ratio',
        key: 'ratio',
        render: (text, media) => `${media.ratioNumerator} / ${media.ratioDenominator}`
      },
      duration: {
        title: 'Durée',
        dataIndex: 'duration',
        key: 'duration',
        render: (text, media) => (media.duration ? media.duration : '-')
      },
      createdAt: {
        title: 'Date de création',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: (a, b) => b.createdAt - a.createdAt,
      },
      updatedAt: {
        title: 'Dernière mise à jour',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        sorter: (a, b) => b.updatedAt - a.updatedAt,
      },
    };

    const propColumns = this.props.columns ? this.props.columns : [];
    let includedPropsColumns = [];

    for (let i = 0; i < propColumns.length; i++) {
      if (columns[propColumns[i].key]) {
        columns[propColumns[i].key] = {
          ...columns[propColumns[i].key],
          ...propColumns[i]
        };
      } else {
        includedPropsColumns.push(propColumns[i]);
      }
    }

    columns = Object.keys(columns).map((key) => columns[key]);
    if (includedPropsColumns.length > 0) {
      columns.splice(2, 0, ...includedPropsColumns);
    }
    return columns;
  }

  render() {

    const columns = this.generateColumns();

    return (
      <DataTable
        columns={columns}
        dataSource={this.props.dataSource}
        loading={this.props.loading}
        onAdd={this.props.onAdd}
        onDelete={this.props.onDelete}
        onDeleteSelection={this.props.onDeleteSelection}
        onEdit={this.props.onEdit}
        onRefresh={this.props.onRefresh}
        onSearch={this.props.onSearch}
        rowSelection={this.props.rowSelection}
      />
    );
  }
}
