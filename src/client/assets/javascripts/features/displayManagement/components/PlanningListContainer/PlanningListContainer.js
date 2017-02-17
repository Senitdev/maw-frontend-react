import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Layout } from 'antd';

import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';
import DataTable from 'components/DataTable';

const mapStateToProps = (state) => {
  const { mediaById, mediaByType } = state[displayManagementName];
  const { isFetching, items } = mediaByType['planning'];

  const plannings = items.map(function(id) {
    return mediaById[id];
  });
  return {
    isFetching,
    plannings
  };
};

@connect(mapStateToProps, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class planningListContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    plannings: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRows: []
    };
  }

  componentDidMount() {
    this.props.actions.fetchMedia('planning');
  }

  onSelectionChange = (selectedRowKeys) => {
    this.setState({ selectedRows: selectedRowKeys });
  }

  onRefresh = () => {
    this.props.actions.fetchMedia('planning');
  }

  onDelete = (id) => {
    this.props.actions.deleteMedia('planning', id);
  }

  onDeleteSelection = () => {

  }

  render() {
    const columns = [{
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => a.id - b.id
      }
    ];

    const rowSelection = {
      onChange: this.onSelectionChange
    };

    return (
      <DataTable
        title="Agendas"
        loading={this.props.isFetching}
        columns={columns}
        dataSource={this.props.plannings}
        rowSelection={rowSelection}
        onRefresh={this.onRefresh}
        onDelete={this.onDelete}
        onDeleteSelection={this.onDeleteSelection}/>
    );
  }
}
