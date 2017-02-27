import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';
import DataTable from 'features/displayManagement/components/DataTable';

const mapStateToProps = (state) => {
  const { mediaById, agenda } = state[displayManagementName];
  const { isFetching, items } = agenda;

  const agendas = items.map(function(id) {
    return mediaById[id];
  });
  return {
    isFetching,
    agendas
  };
};

@connect(mapStateToProps, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class planningListContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    agendas: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRows: []
    };
  }

  componentDidMount() {
    this.props.actions.fetchMediaList('agenda');
  }

  onSelectionChange = (selectedRowKeys) => {
    this.setState({ selectedRows: selectedRowKeys });
  }

  onRefresh = () => {
    this.props.actions.fetchMedia('agenda');
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
    ];

    const rowSelection = {
      onChange: this.onSelectionChange
    };

    return (
      <DataTable
        title="Agendas"
        loading={this.props.isFetching}
        columns={columns}
        dataSource={this.props.agendas}
        rowSelection={rowSelection}
        onRefresh={this.onRefresh}
        onDelete={this.onDelete}
        onEdit="/display-management/agenda/"
        onDeleteSelection={this.onDeleteSelection}/>
    );
  }
}
