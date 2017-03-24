import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ScreenTable from '../../components/ScreenTable';
import { actionCreators as displayManagementActions, selector } from 'features/displayManagement';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
@withRouter
export default class ScreenTableContainer extends Component {

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
    this.props.actions.fetchMediaList('screen');
  }

  /**
   * Extrait et normalise les données du store.
   * Retourne un tableau de média, chacun ayant une valeur suplémentaire "isDeleting".
   */
  getNormalizedData() {
    const { mediaById, 'screen': { items }, isDeleting } = this.props.displayManagement;

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

  onDelete = (screen) => {
    this.props.actions.deleteMedia(screen.id);
  }

  onDeleteSelection = () => {
    for (let i = 0; i < this.state.selectedRows.length; i++) {
      this.props.actions.deleteMedia(this.state.selectedRows[i]);
    }
  }

  onNameEdit = (editedScreen) => {
    this.props.actions.patchMedia(editedScreen);
  }

  onRefresh = () => {
    this.props.actions.fetchMediaList('agenda');
    this.props.actions.fetchMediaList('screen');
  }

  render() {

    const data = this.getNormalizedData();
    const loading = this.props.displayManagement['screen'].isFetching;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRows,
      onChange: this.onSelectionChange
    };

    return (
      <ScreenTable
        dataSource={data}
        loading={loading}
        onAgendaEdit={this.onAgendaChange}
        onDelete={this.onDelete}
        onDeleteSelection={this.onDeleteSelection}
        onEdit={this.onEdit}
        onNameEdit={this.onNameEdit}
        onRefresh={this.onRefresh}
        rowSelection={rowSelection} />
    );
  }
}
