import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import SceneTable from '../../components/SceneTable';
import { actionCreators as displayManagementActions, selector } from 'features/displayManagement';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
@withRouter
export default class SceneTableContainer extends Component {

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
    this.props.actions.fetchMediaList('scene');
  }

  /**
   * Extrait et normalise les données du store.
   * Retourne un tableau de média, chacun ayant une valeur suplémentaire "isDeleting".
   */
  getNormalizedData() {
    const { mediaById, 'scene': { items }, isDeleting } = this.props.displayManagement;

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
    this.props.router.push('/display-management/scene/new');
  }

  onEdit = (scene) => {
    this.props.router.push('/display-management/scene/' + scene.id);
  }

  onDelete = (scene) => {
    this.props.actions.deleteMedia(scene.id);
  }

  onDeleteSelection = () => {
    for (let i = 0; i < this.state.selectedRows.length; i++) {
      this.props.actions.deleteMedia(this.state.selectedRows[i]);
    }
  }

  onNameEdit = (editedScene) => {
    this.props.actions.patchMedia(editedScene);
  }

  onRefresh = () => {
    this.props.actions.fetchMediaList('scene');
  }

  render() {

    const data = this.getNormalizedData();
    const loading = this.props.displayManagement['scene'].isFetching;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRows,
      onChange: this.onSelectionChange
    };

    return (
      <SceneTable
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
