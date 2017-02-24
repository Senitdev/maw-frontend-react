import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';
import DataTable, { EditableCell } from 'components/DataTable';

const mapStateToProps = (state) => {
  const { mediaById, scene } = state[displayManagementName];
  const { isFetching, items } = scene;

  const scenes = items.map(function(id) {
    return mediaById[id];
  });
  return {
    isFetching,
    scenes
  };
};

@connect(mapStateToProps, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class SceneListContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    scenes: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRows: []
    };
  }

  componentDidMount() {
    this.props.actions.fetchMediaList('scene');
  }

  onSelectionChange = (selectedRowKeys) => {
    this.setState({ selectedRows: selectedRowKeys });
  }

  onRefresh = () => {
    this.props.actions.fetchMediaList('scene');
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
    const columns = [{
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => a.id - b.id
      },
      {
        title: 'Nom',
        key: 'name',
        sorter: (a, b) => a.id - b.id,
        render: (file) => <EditableCell file={file} field={'name'} onEdit={this.onEdit} />
      },
      {
        title: 'Date de création',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: (a, b) => a.id - b.id
      },
    ];

    const rowSelection = {
      onChange: this.onSelectionChange
    };

    return (
      <DataTable
        title="Scènes"
        loading={this.props.isFetching}
        columns={columns}
        dataSource={this.props.scenes}
        rowSelection={rowSelection}
        onRefresh={this.onRefresh}
        onEdit="/display-management/scene/"
        onDelete={this.onDelete}
        onDeleteSelection={this.onDeleteSelection}/>
    );
  }
}
