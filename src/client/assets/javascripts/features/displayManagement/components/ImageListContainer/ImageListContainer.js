import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Input, Button } from 'antd';

import { actionCreators as displayManagementActions, selector, NAME as displayManagementName } from '../../';
import DataTable from 'components/DataTable';

const mapStateToProps = (state) => {
  const { mediaById, mediaByType } = state[displayManagementName];
  const { isFetching, items } = mediaByType['image'];

  const images = items.map(function(id) {
    return mediaById[id];
  });
  return {
    isFetching,
    images
  }
};

@connect(mapStateToProps, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class ImageListContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRows: []
    };
  }

  componentDidMount() {
    this.props.actions.fetchMedia('image');
  }

  onSelectionChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows: selectedRowKeys });
  }

  onRefresh = () => {
    this.props.actions.fetchMedia('image');
  }

  onDelete = (id) => {

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
        title="Images"
        loading={this.props.isFetching}
        columns={columns}
        dataSource={this.props.images}
        rowSelection={rowSelection}
        onRefresh={this.onRefresh} />
    );
  }
}
