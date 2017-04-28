import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Button } from 'antd';

import ScreenTable from '../../components/ScreenTable';
import AgendaSelector from '../../components/ScreenTable/AgendaSelector';
import WeekScheduler from '../../components/ScreenTable/WeekScheduler';
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
      scheduleEdit: false,
      scheduleActivity: {start: 0, end: 86400000},
      calendarEdit: false,
      currentEditableScreenId: [],
      agendaIdSelected: -1,
      agendaHasChanged: false,
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

  handleOkEdit = () => {
    var allPromise = [];

    for (var i = 0; i < this.state.currentEditableScreenId.length; i++) {
      //Extrait les infos util à la mise a jours de l'écran.
      var screen = this.props.displayManagement.mediaById[this.state.currentEditableScreenId[i]];
      var relationId = screen.relationsWithGuests.length > 0 ? screen.relationsWithGuests[0] : -1;

      //Si on doit sauvegarder l'agenda et que l'agenda a bien été modifié...
      if (this.state.calendarEdit && this.state.agendaHasChanged) {

        //Si l'écran n'avait pas d'agenda, on crée une nouvelle relation écran-agenda
        if (relationId == -1 && this.state.agendaIdSelected != -1) {

          const relation = {
            hostMediaId: screen.id,
            guestMediaId: parseInt(this.state.agendaIdSelected),
            boxLeft: 0,
            boxTop: 0,
            boxWidth: 100,
            boxHeight: 100,
            guestLeft: 0,
            guestTop: 0,
            guestWidth: 100,
            guestHeight: 100,
            startTimeOffset: 0,
            repetitionDelay: 0,
            endTimeOffset: 0,
            duration: 0,
            zIndex: 0
          };
          allPromise.push(this.props.actions.createRelation(relation));

        //Si l'écran avait un agenda et qu'on veut le changer, on patch la relation
        } else if (relationId != -1 && this.state.agendaIdSelected != -1) {
          const relation = {
            id: relationId,
            guestMediaId: parseInt(this.state.agendaIdSelected),
          };
          allPromise.push(this.props.actions.patchRelation(relation));

        //Si l'écran avait un agenda et qu'on en veut plus, on détruit la relation.
        } else if (relationId > 0 && this.state.agendaIdSelected == -1) {
          allPromise.push(this.props.actions.deleteRelation(relationId));
        }
      }

      //Si on doit sauvegarder de nouveau horraire
      if (this.state.scheduleEdit) {
        allPromise.push(this.props.actions.patchScreen({
          id: screen.id,
          powerOn: this.state.scheduleActivity.start,
          powerOff: this.state.scheduleActivity.end,
        }));
      }
    }

    Promise.all(allPromise).then(this.handleCloseEdit).then(() => this.forceUpdate());
  }

  onScheduleClick = (screen) => {
    this.props.actions.fetchMediaDetails(screen.id, 'screen').then(() => {
      const updatedScreen = this.props.displayManagement.mediaById[screen.id];
      this.setState({
        scheduleEdit: true,
        scheduleActivity: {
          start: updatedScreen.powerOn,
          end: updatedScreen.powerOff,
        },
        currentEditableScreenId: [screen.id],
      })
    });
  }

  onScheduleSelectionClick = () => {
    for (var i = 0; i < this.state.selectedRows.length; i++) {
      this.props.actions.fetchMediaDetails(this.state.selectedRows[i], 'screen');
    }

    this.setState({
      scheduleEdit: true,
      scheduleActivity: {start: 0, end: 86400000},
      currentEditableScreenId: this.state.selectedRows,
    });
  }

  onCalendarClick = (screen) => {
    this.props.actions.fetchMediaDetails(screen.id, 'screen').then(() => {
      //Récupère l'agenda courant pour ce calendrier
      var agendaId;
      if (this.props.displayManagement.mediaById[screen.id].relationsWithGuests.length > 0) {
        agendaId = this.props.displayManagement.relationsById[this.props.displayManagement.mediaById[screen.id].relationsWithGuests[0]].guestMediaId;
      } else {
        agendaId = -1;
      }
      this.setState({
        calendarEdit: true,
        agendaIdSelected: agendaId,
        currentEditableScreenId: [screen.id],
      });
    });
  }

  onCalendarSelectionClick = () => {
    //Récupère les info de tout les écrans sélectionné
    var allPromise = [];
    for (var i = 0; i < this.state.selectedRows.length; i++) {
      allPromise.push(this.props.actions.fetchMediaDetails(this.state.selectedRows[i], 'screen'));
    }

    Promise.all(allPromise).then(() => {
      //Détermine si la sélection a déjà un calendrier commun, et l'enregistre.
      var agendaId;
      if (this.props.displayManagement.mediaById[this.state.selectedRows[0]].relationsWithGuests.length > 0) {
        agendaId = this.props.displayManagement.relationsById[this.props.displayManagement.mediaById[this.state.selectedRows[0]].relationsWithGuests[0]].guestMediaId;
      } else {
        agendaId = -1;
      }
      for (var i = 0; i < this.state.selectedRows.length; i++) {
        var agendaIdBis;
        if (this.props.displayManagement.mediaById[this.state.selectedRows[i]].relationsWithGuests.length > 0) {
          agendaIdBis = this.props.displayManagement.relationsById[this.props.displayManagement.mediaById[this.state.selectedRows[i]].relationsWithGuests[0]].guestMediaId;
        } else {
          agendaIdBis = -1;
        }

        if (agendaId != agendaIdBis) {
          agendaId = null;
          break;
        }
      }

      this.setState({
        calendarEdit: true,
        agendaIdSelected: agendaId,
        currentEditableScreenId: this.state.selectedRows,
      });
    });
  }

  onChangeAgenda = (agendaId) => {
    this.setState({
      agendaHasChanged: true,
      agendaIdSelected: agendaId,
    });
  }

  onScheduleActivityChange = (value) => {
    this.setState({
      scheduleActivity: value[0]
    });
  }

  handleCloseEdit = () => {
    this.setState({
      calendarEdit: false,
      scheduleEdit: false,
      currentEditableScreenId: [],
    });
  }

  render() {

    const data = this.getNormalizedData();
    const loading = this.props.displayManagement['screen'].isFetching;

    // Récupère la liste des agendas. Indexé par ID.
    var agendas = {};
    this.props.displayManagement['agenda'].items.forEach((agendaId) => {
      agendas = {...agendas, [agendaId]: {...this.props.displayManagement.mediaById[agendaId]}};
    });

    //Si une modal d'édition d'horraire ou d'agenda doit s'afficher...
    if (this.state.calendarEdit || this.state.scheduleEdit) {
      // Récupère les ID de tout les écrans séléctionné.
      var currentScreens = [];
      for (var i = 0; i < (this.state.currentEditableScreenId.length); i++) {
        currentScreens.push(this.props.displayManagement.mediaById[this.state.currentEditableScreenId[i]]);
      }

      // Prépars un titre pour la modal d'édition (calendar ou horraire).
      var modalTitle;
      if (this.state.calendarEdit) {
        if (this.state.currentEditableScreenId.length > 1) {
          modalTitle = 'Modifier l\'agenda pour la sélection d\'écrans.';
        } else {
          modalTitle = 'Modifier l\'agenda pour l\'écran \"' + currentScreens[0].name + '\".';
        }
      } else if (this.state.scheduleEdit) {
        if (this.state.currentEditableScreenId.length > 1) {
          modalTitle = 'Modifier les horraires d\'activité de la sélection d\'écrans.';
        } else {
          modalTitle = 'Modifier les horraires d\'activité de l\'écran \"' + currentScreens[0].name + '\".';
        }
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
          onCalendar={this.onCalendarClick}
          onCalendarSelection={this.onCalendarSelectionClick}
          onDelete={this.onDelete}
          onDeleteSelection={this.onDeleteSelection}
          onGroupSelection={(groupName) => console.log(groupName)}
          onNameEdit={this.onNameEdit}
          onRefresh={this.onRefresh}
          onSchedule={this.onScheduleClick}
          onScheduleSelection={this.onScheduleSelectionClick}
          rowSelection={rowSelection} />
          {currentScreens ?
            <Modal title={modalTitle}
                   visible={this.state.scheduleEdit || this.state.calendarEdit}
                   onOk={this.handleOkEdit}
                   onCancel={this.handleCloseEdit}
                   footer={[
                     <Button key="annuler" size="large" onClick={this.handleCloseEdit}>Annuler</Button>,
                     <Button key="Sauvegarder" type="primary" size="large" onClick={this.handleOkEdit}>
                       Sauvegarder
                     </Button>,
                   ]} >
              {this.state.calendarEdit ?
                <AgendaSelector agendas={agendas} value={this.state.agendaIdSelected} onChange={this.onChangeAgenda} />
              : null}
              {this.state.scheduleEdit ?
                <WeekScheduler onChange={this.onScheduleActivityChange}
                               startTime={this.state.scheduleActivity.start}
                               endTime={this.state.scheduleActivity.end} />
              : null}
            </Modal>
          : null}
      </span>
    );
  }
}

/*              <ScreenEditModal ref={(screenEdit) => { this.screenEdit = screenEdit; }}
                               screens={currentScreens}
                               agendas={agendas}
                               relationsById={this.props.displayManagement.relationsById}
                               this.state.scheduleEdit />
                      */
