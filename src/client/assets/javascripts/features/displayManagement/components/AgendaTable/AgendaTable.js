import React, { Component, PropTypes } from 'react';

import MediaTable from '../MediaTable';

export default class AgendaTable extends Component {

  static propTypes = {
    onNameEdit: PropTypes.func,
  };

  render() {

    const columns = [
      MediaTable.ColumnModel.id,
      MediaTable.ColumnModel.name(this.props.onNameEdit),
      MediaTable.ColumnModel.ratio,
      MediaTable.ColumnModel.createdAt,
      MediaTable.ColumnModel.updatedAt,
    ];

    return <MediaTable title="Agendas" columns={columns} {...this.props} />;
  }
}
