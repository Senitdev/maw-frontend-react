import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal } from 'antd';

import ScreenTable from '../../components/ScreenTable';
import ScreenDetailsModal from '../../components/ScreenTable/ScreenDetailsModal';
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
      selectedRows: [],
      modalVisible: false,
      currentEditableScreenId: [],
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

  onEdit = (screen) => {
    this.props.actions.fetchMediaDetails(screen.id, 'screen');
    this.setState({
      modalVisible: true,
      currentEditableScreenId: [screen.id],
    });
  }

  onEditSelection = () => {

    for (var i = 0; i < this.state.selectedRows.length; i++) {
      this.props.actions.fetchMediaDetails(this.state.selectedRows[i], 'screen');
    }

    this.setState({
      modalVisible: true,
      currentEditableScreenId: this.state.selectedRows,
    });
  }

  handleCloseEdit = () => {
    this.setState({
      modalVisible: false,
    });
  }

  handleOkEdit = () => {
    console.log(this.screenDetail);
  }

  render() {

    const data = this.getNormalizedData();
    const loading = this.props.displayManagement['screen'].isFetching;

    // Récupère la liste des agendas. Indexé par ID.
    var agendas = {};
    this.props.displayManagement['agenda'].items.forEach((agendaId) => {
      agendas = {...agendas, [agendaId]: {...this.props.displayManagement.mediaById[agendaId]}};
    });

    // Récupère les ID de tout les écrans séléctionné.
    // Prépars un titre pour la modal d'édition fait de tout les noms d'écrans séléctionné.
    var currentScreens;
    var modalTitle;
    if (this.state.currentEditableScreenId.length > 0) {
      if (this.state.currentEditableScreenId.length == 1)
        modalTitle = 'Edition de l\'écran: ' + this.props.displayManagement.mediaById[this.state.currentEditableScreenId[0]].name;
      else
        modalTitle = 'Edition des écrans: ' + this.props.displayManagement.mediaById[this.state.currentEditableScreenId[0]].name;
      currentScreens = [this.props.displayManagement.mediaById[this.state.currentEditableScreenId[0]]];
      for (var i = 1; i < (this.state.currentEditableScreenId.length); i++) {
        currentScreens.push(this.props.displayManagement.mediaById[this.state.currentEditableScreenId[i]]);
        modalTitle = modalTitle + ', ' + currentScreens[i].name;
      }
    }

    const rowSelection = {
      selectedRowKeys: this.state.selectedRows,
      onChange: this.onSelectionChange
    };

    return (
      <span>
        <ScreenTable
          dataSource={data}
          loading={loading}
          onAgendaEdit={this.onAgendaChange}
          onDelete={this.onDelete}
          onDeleteSelection={this.onDeleteSelection}
          onEdit={this.onEdit}
          onEditSelection={this.onEditSelection}
          onNameEdit={this.onNameEdit}
          onRefresh={this.onRefresh}
          rowSelection={rowSelection} />
        {currentScreens ?
          <Modal key={currentScreens.id}
                 title={modalTitle}
                 visible={this.state.modalVisible}
                 onOk={this.handleOkEdit}
                 onCancel={this.handleCloseEdit} >
            <ScreenDetailsModal ref={(screenDetail) => { this.screenDetail = screenDetail; }}
                                screens={currentScreens}
                                agendas={agendas}
                                relationsById={this.props.displayManagement.relationsById} />
          </Modal>
        : null}
      </span>
    );
  }
}
