import React, { Component, PropTypes } from 'react';

import MediaTable from '../MediaTable';

export default class SceneTable extends Component {

  static propTypes = {
    onNameEdit: PropTypes.func,
  };

  render() {

    const columns = [
      MediaTable.ColumnModel.name(this.props.onNameEdit),
      MediaTable.ColumnModel.ratio,
      MediaTable.ColumnModel.duration,
      MediaTable.ColumnModel.createdAt,
      MediaTable.ColumnModel.updatedAt,
    ];

    return <MediaTable title="Scènes" columns={columns} {...this.props} />;
  }
}
