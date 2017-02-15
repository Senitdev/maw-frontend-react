import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';
import DataTable from 'components/DataTable';

const mapStateToProps = (state) => {
  const { mediaById, mediaByType } = state[displayManagementName];
  const { isFetching, items } = mediaByType['scene'];

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
    this.props.actions.fetchMedia('scene');
  }

  onSelectionChange = (selectedRowKeys) => {
    this.setState({ selectedRows: selectedRowKeys });
  }

  onRefresh = () => {
    this.props.actions.fetchMedia('scene');
  }

  onDelete = (id) => {
    this.props.actions.deleteMedia('scene', id);
  }

  onDeleteSelection = () => {

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
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.id - b.id
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
        onDelete={this.onDelete}
        onDeleteSelection={this.onDeleteSelection}/>
    );
  }
}
