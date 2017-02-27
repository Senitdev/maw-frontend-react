import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';
import DataTable from 'features/displayManagement/components/DataTable';

const mapStateToProps = (state) => {
  const { mediaById, file } = state[displayManagementName];
  const { isFetching, items } = file;

  const files = items.map(function(id) {
    return mediaById[id];
  });
  return {
    isFetching,
    files
  };
};

@connect(mapStateToProps, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class FileListContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    files: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRows: []
    };
  }

  componentDidMount() {
    this.props.actions.fetchMediaList('file');
  }

  onSelectionChange = (selectedRowKeys) => {
    this.setState({ selectedRows: selectedRowKeys });
  }

  onRefresh = () => {
    this.props.actions.fetchMediaList('file');
  }

  onDelete = (id) => {
    this.props.actions.deleteMedia(id);
  }

  onDeleteSelection = () => {
    for (let i=0; i<this.state.selectedRows.length; i++) {
      this.props.actions.deleteMedia(this.state.selectedRows[i]);
    }
  }
  onEdit(editedFile) {
    console.log(editedFile);
  }
  render() {
    const columns = [
      {
        title: 'Résolution',
        key: 'resolution',
        render: (file) => <span>{file.width}x{file.height} (px)</span>,
      },
      {
        title: 'Poid',
        key: 'weight',
        sorter: (a, b) => a.id - b.id,
        render: (file) => <span>{file.weight} (Ko)</span>
      },
      {
        title: 'mimetype',
        dataIndex: 'mimetype',
        key: 'mimetype',
        sorter: (a, b) => a.id - b.id,
      }
    ];

    const rowSelection = {
      onChange: this.onSelectionChange
    };

    return (
      <DataTable
        title="Fichiers"
        loading={this.props.isFetching}
        columns={columns}
        dataSource={this.props.files}
        rowSelection={rowSelection}
        onRefresh={this.onRefresh}
        onDelete={this.onDelete}
        onDeleteSelection={this.onDeleteSelection}/>
    );
  }
}
