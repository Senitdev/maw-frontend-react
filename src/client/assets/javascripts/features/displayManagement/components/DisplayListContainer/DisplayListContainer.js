import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Layout } from 'antd';

import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';
import DataTable from 'components/DataTable';

const mapStateToProps = (state) => {
  const { mediaById, mediaByType } = state[displayManagementName];
  const { isFetching, items } = mediaByType['display'];

  const displays = items.map(function(id) {
    return mediaById[id];
  });
  return {
    isFetching,
    displays
  };
};

@connect(mapStateToProps, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class DisplayListContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    displays: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRows: []
    };
  }

  componentDidMount() {
    this.props.actions.fetchMedia('display');
  }

  onSelectionChange = (selectedRowKeys) => {
    this.setState({ selectedRows: selectedRowKeys });
  }

  onRefresh = () => {
    this.props.actions.fetchMedia('display');
  }

  onDelete = (id) => {
    this.props.actions.deleteMedia('display', id);
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
      <Layout>
        <Layout.Header>Écrans</Layout.Header>
        <Layout.Content>
          <DataTable
            title="Écrans"
            loading={this.props.isFetching}
            columns={columns}
            dataSource={this.props.displays}
            rowSelection={rowSelection}
            onRefresh={this.onRefresh}
            onDelete={this.onDelete}
            onDeleteSelection={this.onDeleteSelection}/>
        </Layout.Content>
      </Layout>
    );
  }
}
