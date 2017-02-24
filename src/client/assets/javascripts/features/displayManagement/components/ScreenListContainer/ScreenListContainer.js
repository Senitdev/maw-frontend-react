import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';
import DataTable, { EditableCell } from 'features/displayManagement/components/DataTable';

const mapStateToProps = (state) => {
  const { mediaById, screen } = state[displayManagementName];
  const { isFetching, items } = screen;

  const screens = items.map(function(id) {
    return mediaById[id];
  });
  return {
    isFetching,
    screens
  };
};

@connect(mapStateToProps, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class ScreenListContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    screens: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRows: []
    };
  }

  componentDidMount() {
    this.props.actions.fetchMediaList('screen');
  }

  onSelectionChange = (selectedRowKeys) => {
    this.setState({ selectedRows: selectedRowKeys });
  }

  onRefresh = () => {
    this.props.actions.fetchMediaList('screen');
  }

  onDelete = (id) => {
    this.props.actions.deleteMedia(id);
  }

  onDeleteSelection = () => {
    for (let i=0; i<this.state.selectedRows.length; i++) {
      this.props.actions.deleteMedia(this.state.selectedRows[i]);
    }
  }

  render() {
    const columns = [{
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => a.id - b.id
      },
      {
        title: 'Version',
        dataIndex: 'distantVersion',
        key: 'distantVersion',
        sorter: (a, b) => a.id - b.id
      },
      {
        title: 'Dernier contact',
        dataIndex: 'lastPull',
        key: 'lastPull',
        sorter: (a, b) => a.id - b.id
      },
    ];

    const rowSelection = {
      onChange: this.onSelectionChange
    };

    return (
      <DataTable
        title="Écrans"
        loading={this.props.isFetching}
        columns={columns}
        dataSource={this.props.screens}
        rowSelection={rowSelection}
        onRefresh={this.onRefresh}
        onDelete={this.onDelete}
        onDeleteSelection={this.onDeleteSelection}/>
    );
  }
}
