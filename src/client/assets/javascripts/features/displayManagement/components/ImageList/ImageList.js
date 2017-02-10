import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Input, Button } from 'antd';

import { actionCreators as displayManagementActions, selector, NAME as displayManagementName } from '../../';

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
export default class ImageList extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
  };

  componentDidMount() {
    this.props.actions.fetchMedia('image');
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
      },
      {
        title: 'Date de création',
        dataIndex: 'createdAt',
        key: 'createdAt',
      },
    ];

    return (
      <Table title={()=><h1>Bite</h1>} isLoading={this.props.isFetching} columns={columns} dataSource={this.props.images} rowKey={image => image.id} />
    );
  }
}
