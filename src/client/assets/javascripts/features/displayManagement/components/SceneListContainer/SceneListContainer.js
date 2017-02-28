import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';
import DataTable from 'features/displayManagement/components/DataTable';

const mapStateToProps = (state) => {
  const { mediaById, scene, isDeleting } = state[displayManagementName];
  const { isFetching, items } = scene;

  const scenes = items.map(function(id) {
    return {
      ...mediaById[id],
      isDeleting: isDeleting[id]
    };
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
  onEdit = (editedFile) => {
    this.props.actions.patchMedia(editedFile);
  }

  render() {
    const columns = [

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
        onAdd="/display-management/scene/new"
        onRefresh={this.onRefresh}
        onEdit="/display-management/scene/"
        onDelete={this.onDelete}
        onDeleteSelection={this.onDeleteSelection}
        editMedia={this.onEdit} />
    );
  }
}
