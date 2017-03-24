import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import AgendaTable from '../../components/AgendaTable';
import { actionCreators as displayManagementActions, selector } from 'features/displayManagement';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
@withRouter
export default class AgendaTableContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    displayManagement: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRows: []
    };
  }

  /**
   * Lorsque le composant va être affiché, les données sont récupérées du serveur.
   */
  componentWillMount() {
    this.props.actions.fetchMediaList('agenda');
  }

  /**
   * Extrait et normalise les données du store.
   * Retourne un tableau de média, chacun ayant une valeur suplémentaire "isDeleting".
   */
  getNormalizedData() {
    const { mediaById, 'agenda': { items }, isDeleting } = this.props.displayManagement;

    return items.map(function(id) {
      return {
        ...mediaById[id],
        isDeleting: isDeleting[id]
      };
    });
  }

  onSelectionChange = (selectedRowKeys) => {
    this.setState({ selectedRows: selectedRowKeys });
  }

  onAdd = () => {
    this.props.router.push('/display-management/agenda/new');
  }

  onEdit = (agenda) => {
    this.props.router.push('/display-management/agenda/' + agenda.id);
  }

  onDelete = (agenda) => {
    this.props.actions.deleteMedia(agenda.id);
  }

  onDeleteSelection = () => {
    for (let i = 0; i < this.state.selectedRows.length; i++) {
      this.props.actions.deleteMedia(this.state.selectedRows[i]);
    }
  }

  onNameEdit = (editedAgenda) => {
    this.props.actions.patchMedia(editedAgenda);
  }

  onRefresh = () => {
    this.props.actions.fetchMediaList('agenda');
  }

  render() {

    const data = this.getNormalizedData();
    const loading = this.props.displayManagement['agenda'].isFetching;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRows,
      onChange: this.onSelectionChange
    };

    return (
      <AgendaTable
        dataSource={data}
        loading={loading}
        onAdd={this.onAdd}
        onDelete={this.onDelete}
        onDeleteSelection={this.onDeleteSelection}
        onEdit={this.onEdit}
        onNameEdit={this.onNameEdit}
        onRefresh={this.onRefresh}
        rowSelection={rowSelection} />
    );
  }
}
