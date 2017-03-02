import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MediaTable from '../MediaTable';
import { actionCreators as displayManagementActions, selector } from 'features/displayManagement';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class MediaTableContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    columns: PropTypes.array,
    displayManagement: PropTypes.object,
    mediaType: PropTypes.string.isRequired,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      searchText: ''
    };
  }

  /**
   * Lorsque le composant va être affiché, les données sont récupérées du serveur.
   */
  componentWillMount() {
    this.props.actions.fetchMediaList(this.props.mediaType);
  }

  /**
   * Extrait et normalise les données du store.
   * Retourne un tableau de média, chacun ayant une valeur suplémentaire "isDeleting".
   */
  extractData() {
    const { mediaById, [this.props.mediaType]: { items }, isDeleting } = this.props.displayManagement;

    return items.map(function(id) {
      return {
        ...mediaById[id],
        isDeleting: isDeleting[id]
      };
    });
  }

  /**
   * Recherche dans les données passées en paramètre les enregistrements correspondant au texte de recherche.
   * Seul le nom du média est analysé.
   */
  searchData(data) {
    if (! this.state.searchText) {
      return data;
    }

    const reg = new RegExp(this.state.searchText, 'gi');

    return data.map((media) => {
      const match = media.name.match(reg);
      return (match ? media : null);
    }).filter((record) => !!record);
  }

  /**
   * Récupère les données du store devant être affichée. Cette méthode fait appel à `extractData` et `searchData`.
   */
  getShownData() {
    return this.searchData(this.extractData());
  }

  onSearch = (text) => {
    this.setState({ searchText: text });
  }

  onSelectionChange = (selectedRowKeys) => {
    this.setState({ selectedRows: selectedRowKeys });
  }

  onDelete = (id) => {
    this.props.actions.deleteMedia(id);
  }

  onDeleteSelection = () => {
    for (let i = 0; i < this.state.selectedRows.length; i++) {
      this.props.actions.deleteMedia(this.state.selectedRows[i]);
    }
  }

  onNameEdit = (editedMedia) => {
    this.props.actions.patchMedia(editedMedia);
  }

  onRefresh = () => {
    this.props.actions.fetchMediaList(this.props.mediaType);
  }

  render() {

    const data = this.getShownData();
    const loading = this.props.displayManagement[this.props.mediaType].isFetching;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRows,
      onChange: this.onSelectionChange
    };

    return (
      <MediaTable
        columns={this.props.columns}
        dataSource={data}
        loading={loading}
        onAdd={this.props.onAdd}
        onDelete={this.onDelete}
        onDeleteSelection={this.onDeleteSelection}
        onEdit={this.props.onEdit}
        onNameEdit={this.onNameEdit}
        onRefresh={this.onRefresh}
        onSearch={this.onSearch}
        rowSelection={rowSelection}
      />
    );
  }
}
